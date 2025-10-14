from rest_framework import serializers
from .models import N8nTemplate


class N8nTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = N8nTemplate
        fields = ['id', 'name', 'description', 'download_url', 'external_id', 'score', 'available_on_website', 'created_at', 'updated_at']
