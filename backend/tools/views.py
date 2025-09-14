from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tool
from .serializers import ToolSerializer


class ToolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tool.objects.all()
    serializer_class = ToolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'pricing', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['rating', 'name', 'created_at']
    ordering = ['-rating', 'name']
