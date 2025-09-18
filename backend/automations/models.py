from django.db import models


class Template(models.Model):
    COMPLEXITY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('coming_soon', 'Coming Soon'),
        ('beta', 'Beta'),
    ]

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES)
    time_saved = models.CharField(max_length=50, help_text="e.g., '2-3 hours/week'")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    setup_instructions = models.TextField(blank=True)
    score = models.FloatField(default=0.0)
    file_url = models.URLField(blank=True, null=True)
    external_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'name']

    def __str__(self):
        return self.name
