from django.db import models


class Tool(models.Model):
    PRICING_CHOICES = [
        ('free', 'Free'),
        ('freemium', 'Freemium'),
        ('paid', 'Paid'),
        ('enterprise', 'Enterprise'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    url = models.URLField()
    pricing = models.CharField(max_length=20, choices=PRICING_CHOICES)
    rating = models.FloatField(default=0.0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return self.name
