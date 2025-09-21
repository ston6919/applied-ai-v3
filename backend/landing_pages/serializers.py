from rest_framework import serializers
from .models import LandingPage


class LandingPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPage
        fields = ['id', 'title', 'slug', 'description', 'template_content', 'is_active', 'created_at']


class LandingPageSubmissionStepSerializer(serializers.Serializer):
    BUSINESS_TYPE_CHOICES = [
        ('implement', 'Looking to implement this in my business'),
        ('sell_services', 'Looking to sell AI services to other businesses'),
    ]
    
    step = serializers.CharField()
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False, max_length=100)
    business_type = serializers.ChoiceField(
        choices=BUSINESS_TYPE_CHOICES,
        required=False
    )

    def validate_email(self, value):
        if value and '@' not in value:
            raise serializers.ValidationError("Please enter a valid email address.")
        return value.lower().strip() if value else value
