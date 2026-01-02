from rest_framework import viewsets, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import Coalesce
from .models import CanonicalNewsStory, CapturedNewsStory
from .serializers import CanonicalNewsStorySerializer, CapturedNewsStorySerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CanonicalNewsStoryViewSet(viewsets.ModelViewSet):
    queryset = CanonicalNewsStory.objects.annotate(
        sort_date=Coalesce('event_time', 'created_at')
    ).order_by('-sort_date')
    serializer_class = CanonicalNewsStorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'summary']
    ordering_fields = ['created_at', 'event_time', 'rank']
    ordering = ['-sort_date']


class CapturedNewsStoryViewSet(viewsets.ModelViewSet):
    queryset = CapturedNewsStory.objects.all()
    serializer_class = CapturedNewsStorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['source', 'canonical_story']
    search_fields = ['title', 'text', 'author']
    ordering_fields = ['captured_at', 'published_date']
    ordering = ['-captured_at']
