from django.db import models


class N8nTemplate(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    download_url = models.URLField()
    external_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    score = models.FloatField(default=0.0)
    available_on_website = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score', 'name']

    def __str__(self):
        return self.name