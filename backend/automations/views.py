from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Automation
from .serializers import AutomationSerializer


class AutomationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Automation.objects.all()
    serializer_class = AutomationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'complexity', 'status', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-is_featured', 'name']
