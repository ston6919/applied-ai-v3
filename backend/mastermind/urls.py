from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipTierViewSet, MemberViewSet

router = DefaultRouter()
router.register(r'tiers', MembershipTierViewSet)
router.register(r'members', MemberViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
