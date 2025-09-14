from django.db import models
from django.utils import timezone


class NewsArticle(models.Model):
    title = models.CharField(max_length=200)
    summary = models.TextField()
    content = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    url = models.URLField(blank=True)
    published_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title
