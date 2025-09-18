from django.db import models
from django.utils import timezone
import json


class CanonicalNewsStory(models.Model):
    STATUS_CHOICES = [
        ('unranked', 'Unranked'),
        ('ranked', 'Ranked'),
    ]
    
    title = models.CharField(max_length=500)
    summary = models.TextField()
    event_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unranked')
    rank = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Canonical News Story'
        verbose_name_plural = 'Canonical News Stories'

    def __str__(self):
        return self.title


class CapturedNewsStory(models.Model):
    source = models.CharField(max_length=100)
    source_id = models.IntegerField()
    url = models.URLField()
    title = models.CharField(max_length=500)
    text = models.TextField()
    published_date = models.DateTimeField()
    captured_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=200, blank=True)
    canonical_story = models.ForeignKey(
        CanonicalNewsStory, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='captured_stories'
    )
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-captured_at']
        verbose_name = 'Captured News Story'
        verbose_name_plural = 'Captured News Stories'
        unique_together = ['source', 'source_id']

    def __str__(self):
        return f"{self.source}: {self.title}"


