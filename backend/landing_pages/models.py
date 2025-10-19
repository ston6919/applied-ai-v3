from django.db import models
from django.utils import timezone


class LandingPage(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, help_text="URL-friendly version of the title")
    description = models.TextField(blank=True)
    template_content = models.TextField(blank=True, null=True, help_text="The template content to deliver to users")
    mailerlite_group_ids = models.JSONField(default=list, help_text="List of MailerLite group IDs for this landing page")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class WaitingListSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    business_name = models.CharField(max_length=200)
    project_nature = models.TextField()
    budget = models.CharField(max_length=50)
    mailerlite_subscribed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.business_name}"

