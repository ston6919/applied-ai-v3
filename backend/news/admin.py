from django.contrib import admin
from .models import CanonicalNewsStory, CapturedNewsStory


@admin.register(CanonicalNewsStory)
class CanonicalNewsStoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'rank', 'event_time', 'created_at']
    list_filter = ['status', 'created_at', 'event_time']
    search_fields = ['title', 'summary']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(CapturedNewsStory)
class CapturedNewsStoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'source', 'author', 'published_date', 'captured_at', 'canonical_story']
    list_filter = ['source', 'canonical_story', 'published_date', 'captured_at']
    search_fields = ['title', 'text', 'author', 'source']
    date_hierarchy = 'captured_at'
    ordering = ['-captured_at']
    readonly_fields = ['captured_at']
    raw_id_fields = ['canonical_story']
