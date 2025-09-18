from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Tool(models.Model):
    PRICING_CHOICES = [
        ('free', 'Free'),
        ('freemium', 'Freemium'),
        ('paid', 'Paid'),
        ('enterprise', 'Enterprise'),
    ]

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    url = models.URLField()
    image_url = models.URLField(blank=True, null=True)
    pricing = models.CharField(max_length=20, choices=PRICING_CHOICES)
    is_featured = models.BooleanField(default=False)
    date_added = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category, related_name='tools', blank=True)

    class Meta:
        ordering = ['-created_at', 'name']

    def __str__(self):
        return self.name
