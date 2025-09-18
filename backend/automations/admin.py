from django.contrib import admin
from .models import Template


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'complexity', 'status', 'is_featured']
    list_filter = ['category', 'complexity', 'status', 'is_featured']
    search_fields = ['name', 'description']
    ordering = ['-is_featured', 'name']
