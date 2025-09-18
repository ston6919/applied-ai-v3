from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import CanonicalNewsStory, CapturedNewsStory
from .serializers import CanonicalNewsStorySerializer, CapturedNewsStorySerializer


class CanonicalNewsStoryViewSet(viewsets.ModelViewSet):
    queryset = CanonicalNewsStory.objects.all()
    serializer_class = CanonicalNewsStorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'summary']
    ordering_fields = ['created_at', 'event_time', 'rank']
    ordering = ['-created_at']


class CapturedNewsStoryViewSet(viewsets.ModelViewSet):
    queryset = CapturedNewsStory.objects.all()
    serializer_class = CapturedNewsStorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['source', 'canonical_story']
    search_fields = ['title', 'text', 'author']
    ordering_fields = ['captured_at', 'published_date']
    ordering = ['-captured_at']
