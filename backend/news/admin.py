from django.contrib import admin
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path
from django.http import HttpResponseRedirect
from django.contrib import messages
from .models import CanonicalNewsStory, CapturedNewsStory


@staff_member_required
def rank_stories_view(request):
    """Custom view for ranking unranked canonical news stories"""
    if request.method == 'POST':
        story_id = request.POST.get('story_id')
        rank = request.POST.get('rank')
        action = request.POST.get('action')
        
        if story_id and action == 'undo':
            # Handle undo action
            try:
                story = get_object_or_404(CanonicalNewsStory, id=story_id)
                story.rank = None
                story.status = 'unranked'
                story.save()
                messages.success(request, f'Story "{story.title}" has been unranked and is now available for ranking again.')
                return redirect('admin:news_canonicalnewsstory_rank_stories')
            except Exception as e:
                messages.error(request, f'Error unranking story: {str(e)}')
        elif story_id and rank:
            # Handle ranking action
            try:
                story = get_object_or_404(CanonicalNewsStory, id=story_id)
                story.rank = int(rank)
                story.status = 'ranked'
                story.save()
                # Create a success message with undo button
                undo_url = f'?action=undo&story_id={story_id}'
                from django.utils.safestring import mark_safe
                message = mark_safe(f'Story "{story.title}" has been ranked as #{rank} <a href="{undo_url}" class="button" style="margin-left: 10px; background: #dc3545; color: white; padding: 4px 8px; text-decoration: none; border-radius: 3px; font-size: 12px;">Undo</a>')
                messages.success(request, message)
                return redirect('admin:news_canonicalnewsstory_rank_stories')
            except ValueError:
                messages.error(request, 'Invalid rank value')
            except Exception as e:
                messages.error(request, f'Error updating story: {str(e)}')
    
    # Handle undo from URL parameters
    if request.GET.get('action') == 'undo' and request.GET.get('story_id'):
        story_id = request.GET.get('story_id')
        try:
            story = get_object_or_404(CanonicalNewsStory, id=story_id)
            story.rank = None
            story.status = 'unranked'
            story.save()
            messages.success(request, f'Story "{story.title}" has been unranked and is now available for ranking again.')
            return redirect('admin:news_canonicalnewsstory_rank_stories')
        except Exception as e:
            messages.error(request, f'Error unranking story: {str(e)}')
    
    # Get unranked stories
    unranked_stories = CanonicalNewsStory.objects.filter(status='unranked').order_by('-created_at')
    
    context = {
        'title': 'Rank Unranked Stories',
        'unranked_stories': unranked_stories,
        'has_permission': True,
        'opts': CanonicalNewsStory._meta,
    }
    
    return render(request, 'admin/news/rank_stories.html', context)


@admin.register(CanonicalNewsStory)
class CanonicalNewsStoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'rank', 'event_time', 'created_at']
    list_filter = ['status', 'created_at', 'event_time']
    search_fields = ['title', 'summary']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('rank-stories/', rank_stories_view, name='news_canonicalnewsstory_rank_stories'),
        ]
        return custom_urls + urls
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['rank_stories_url'] = 'admin:news_canonicalnewsstory_rank_stories'
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(CapturedNewsStory)
class CapturedNewsStoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'source', 'author', 'published_date', 'captured_at', 'canonical_story']
    list_filter = ['source', 'canonical_story', 'published_date', 'captured_at']
    search_fields = ['title', 'text', 'author', 'source']
    date_hierarchy = 'captured_at'
    ordering = ['-captured_at']
    readonly_fields = ['captured_at']
    raw_id_fields = ['canonical_story']
