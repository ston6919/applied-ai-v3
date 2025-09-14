from rest_framework import viewsets
from .models import MembershipTier, Member
from .serializers import MembershipTierSerializer, MemberSerializer


class MembershipTierViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MembershipTier.objects.filter(is_active=True)
    serializer_class = MembershipTierSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.filter(is_active=True)
    serializer_class = MemberSerializer
