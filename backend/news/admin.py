from django.contrib import admin
from .models import NewsArticle


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_at', 'is_featured']
    list_filter = ['category', 'is_featured', 'published_at']
    search_fields = ['title', 'summary']
    date_hierarchy = 'published_at'
    ordering = ['-published_at']
