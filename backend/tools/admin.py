from django.contrib import admin
from .models import Tool, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'pricing', 'is_featured', 'date_added']
    list_filter = ['pricing', 'is_featured', 'categories']
    search_fields = ['name', 'description']
    filter_horizontal = ['categories']
    ordering = ['-created_at', 'name']
