from rest_framework import serializers
from .models import Tool, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ToolSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), write_only=True, required=False, source='categories'
    )
    affiliate_url = serializers.URLField(required=False, allow_blank=True)
    pricing = serializers.ChoiceField(choices=Tool.PRICING_CHOICES, required=False)

    class Meta:
        model = Tool
        fields = '__all__'
