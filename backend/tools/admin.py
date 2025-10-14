from django.contrib import admin
from .models import Tool, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'pricing', 'is_featured', 'show_on_site', 'date_added']
    list_filter = ['pricing', 'is_featured', 'show_on_site', 'categories']
    search_fields = ['name', 'description', 'external_id']
    filter_horizontal = ['categories']
    ordering = ['-created_at', 'name']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'features', 'new_features')
        }),
        ('URLs', {
            'fields': ('website_url', 'source_url', 'image_url')
        }),
        ('Settings', {
            'fields': ('pricing', 'is_featured', 'show_on_site', 'external_id', 'date_added', 'last_updated')
        }),
        ('Categories', {
            'fields': ('categories',)
        }),
    )
