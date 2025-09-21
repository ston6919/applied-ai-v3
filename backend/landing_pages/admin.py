from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from django.shortcuts import render
from django.contrib import messages
from .models import LandingPage
from .widgets import MailerLiteGroupSelectWidget, MailerLiteGroupMultiSelectWidget
from .mailerlite_service import MailerLiteService
from .forms import LandingPageForm


@admin.register(LandingPage)
class LandingPageAdmin(admin.ModelAdmin):
    form = LandingPageForm
    list_display = ['title', 'slug', 'get_groups_display', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'slug', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    
    def get_groups_display(self, obj):
        """Display group names instead of IDs in list view"""
        if obj.mailerlite_group_ids:
            mailerlite_service = MailerLiteService()
            group_names = []
            for group_id in obj.mailerlite_group_ids:
                group_name = mailerlite_service.get_group_name_by_id(group_id)
                group_names.append(group_name)
            return ", ".join(group_names)
        return "No Groups Selected"
    get_groups_display.short_description = "MailerLite Groups"
    
    def get_urls(self):
        """Add custom URL for refreshing groups"""
        urls = super().get_urls()
        custom_urls = [
            path('refresh-groups/', self.admin_site.admin_view(self.refresh_groups), 
                 name='landing_pages_landingpage_refresh_groups'),
        ]
        return custom_urls + urls
    
    def refresh_groups(self, request):
        """Clear MailerLite groups cache and refresh"""
        try:
            mailerlite_service = MailerLiteService()
            
            # Check if API key is configured
            if not mailerlite_service.api_key:
                messages.error(request, 'MailerLite API key is not configured. Please add MAILERLITE_API_KEY to your environment variables.')
                return JsonResponse({'status': 'error', 'message': 'API key not configured'})
            
            # Clear cache first
            mailerlite_service.clear_groups_cache()
            messages.info(request, 'Cache cleared. Fetching fresh data from MailerLite...')
            
            # Test the connection by fetching groups
            groups = mailerlite_service.get_groups_for_admin()
            
            if groups:
                messages.success(request, f'Successfully refreshed {len(groups)} groups from MailerLite.')
                return JsonResponse({'status': 'success', 'count': len(groups)})
            else:
                # Try to get more detailed error info
                raw_response = mailerlite_service.get_groups()
                if raw_response is None:
                    messages.error(request, 'Failed to connect to MailerLite API. Check your API key and internet connection.')
                elif isinstance(raw_response, dict) and 'data' in raw_response and not raw_response['data']:
                    messages.warning(request, 'Connected to MailerLite but no groups found. You may need to create groups in your MailerLite account.')
                else:
                    messages.error(request, f'Unexpected response from MailerLite API: {raw_response}')
                return JsonResponse({'status': 'error', 'message': 'No groups found'})
                
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            messages.error(request, f'Error refreshing groups: {str(e)}')
            logger.error(f"Admin refresh groups error: {error_details}")
            return JsonResponse({'status': 'error', 'message': str(e)})

