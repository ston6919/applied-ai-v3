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
    short_description = models.TextField()
    description = models.TextField(blank=True, default='')
    features = models.JSONField(default=list, blank=True, null=True)  # Array of strings
    new_features = models.JSONField(default=list, blank=True, null=True)  # Array of strings for new features
    website_url = models.URLField(verbose_name='Website URL', blank=True, default='')
    affiliate_url = models.URLField(verbose_name='Affiliate URL', blank=True, default='')
    source_url = models.URLField(blank=True, null=True, verbose_name='Source URL')
    image_url = models.URLField(blank=True, null=True, verbose_name='Image URL')
    external_id = models.IntegerField(blank=True, null=True, db_index=True)
    show_on_site = models.BooleanField(default=True)
    pricing = models.CharField(max_length=20, choices=PRICING_CHOICES)
    is_featured = models.BooleanField(default=False)
    date_added = models.DateField(null=True, blank=True)
    last_updated = models.DateField(null=True, blank=True, verbose_name='Last Updated (Manual)')
    table_order = models.IntegerField(default=0, db_index=True, verbose_name='Table View Order')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category, related_name='tools', blank=True)

    class Meta:
        ordering = ['table_order', '-created_at', 'name']

    def __str__(self):
        return self.name
