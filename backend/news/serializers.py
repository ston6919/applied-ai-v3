from rest_framework import serializers
from .models import CanonicalNewsStory, CapturedNewsStory


class CanonicalNewsStorySerializer(serializers.ModelSerializer):
    captured_stories_count = serializers.SerializerMethodField()
    source_url = serializers.SerializerMethodField()
    source_name = serializers.SerializerMethodField()
    
    class Meta:
        model = CanonicalNewsStory
        fields = '__all__'
    
    def get_captured_stories_count(self, obj):
        return obj.captured_stories.count()

    def get_source_url(self, obj):
        first_story = obj.captured_stories.first()
        return first_story.url if first_story else None

    def get_source_name(self, obj):
        first_story = obj.captured_stories.first()
        if first_story and first_story.url:
            from urllib.parse import urlparse
            domain = urlparse(first_story.url).netloc
            return domain.replace('www.', '')
        return first_story.source if first_story else None


class CapturedNewsStorySerializer(serializers.ModelSerializer):
    canonical_story_title = serializers.CharField(source='canonical_story.title', read_only=True)
    
    class Meta:
        model = CapturedNewsStory
        fields = '__all__'
