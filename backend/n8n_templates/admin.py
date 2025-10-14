from django.contrib import admin
from .models import N8nTemplate


@admin.register(N8nTemplate)
class N8nTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'score', 'available_on_website', 'external_id', 'created_at']
    list_filter = ['available_on_website', 'created_at', 'score']
    search_fields = ['name', 'description', 'external_id']
    ordering = ['-score', 'name']