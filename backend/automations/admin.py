from django.contrib import admin
from .models import Automation


@admin.register(Automation)
class AutomationAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'complexity', 'status', 'is_featured']
    list_filter = ['category', 'complexity', 'status', 'is_featured']
    search_fields = ['name', 'description']
    ordering = ['-is_featured', 'name']
