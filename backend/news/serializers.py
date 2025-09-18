from rest_framework import serializers
from .models import CanonicalNewsStory, CapturedNewsStory


class CanonicalNewsStorySerializer(serializers.ModelSerializer):
    captured_stories_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CanonicalNewsStory
        fields = '__all__'
    
    def get_captured_stories_count(self, obj):
        return obj.captured_stories.count()


class CapturedNewsStorySerializer(serializers.ModelSerializer):
    canonical_story_title = serializers.CharField(source='canonical_story.title', read_only=True)
    
    class Meta:
        model = CapturedNewsStory
        fields = '__all__'
