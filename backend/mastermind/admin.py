from django.contrib import admin
from .models import MembershipTier, Member


@admin.register(MembershipTier)
class MembershipTierAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'is_popular', 'is_active']
    list_filter = ['is_popular', 'is_active']
    ordering = ['price']


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'membership_tier', 'is_active', 'joined_at']
    list_filter = ['membership_tier', 'is_active', 'joined_at']
    search_fields = ['first_name', 'last_name', 'email']
    ordering = ['-joined_at']
