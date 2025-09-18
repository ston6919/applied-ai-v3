from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Template
from .serializers import TemplateSerializer


class TemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'complexity', 'status', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-is_featured', 'name']
