from django.contrib import admin
from .models import Tool


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'pricing', 'rating', 'is_featured']
    list_filter = ['category', 'pricing', 'is_featured']
    search_fields = ['name', 'description']
    ordering = ['-rating', 'name']
