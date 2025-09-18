from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CanonicalNewsStoryViewSet, CapturedNewsStoryViewSet

router = DefaultRouter()
router.register(r'canonical-stories', CanonicalNewsStoryViewSet)
router.register(r'captured-stories', CapturedNewsStoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
