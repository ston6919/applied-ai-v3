from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import LandingPage
from .serializers import (
    LandingPageSerializer, 
    LandingPageSubmissionStepSerializer
)
from .mailerlite_service import MailerLiteService
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_landing_page(request, slug):
    """Get landing page by slug"""
    try:
        landing_page = get_object_or_404(LandingPage, slug=slug, is_active=True)
        serializer = LandingPageSerializer(landing_page)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error getting landing page {slug}: {str(e)}")
        return Response(
            {'error': 'Landing page not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_landing_page_step(request, slug):
    """Handle multi-step landing page submission"""
    try:
        landing_page = get_object_or_404(LandingPage, slug=slug, is_active=True)
        serializer = LandingPageSubmissionStepSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        step = data.get('step')
        email = data.get('email')
        first_name = data.get('first_name')
        business_type = data.get('business_type')
        
        mailerlite_service = MailerLiteService()
        
        if step == 'email':
            # Step 1: Create subscriber in MailerLite with email and first name
            if not email or not first_name:
                return Response(
                    {'error': 'Email and first name are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if subscriber already exists
            existing_subscriber = mailerlite_service.get_subscriber(email)
            
            if existing_subscriber:
                # Add to all groups if not already in them
                for group_id in landing_page.mailerlite_group_ids:
                    mailerlite_service.add_subscriber_to_group(email, group_id)
                # Update first name if provided
                mailerlite_service.update_subscriber(email, first_name=first_name)
            else:
                # Create new subscriber with first name and add to all groups
                result = mailerlite_service.create_subscriber(
                    email, 
                    landing_page.mailerlite_group_ids[0] if landing_page.mailerlite_group_ids else None,
                    first_name=first_name
                )
                # Add to additional groups if there are more than one
                if result and len(landing_page.mailerlite_group_ids) > 1:
                    for group_id in landing_page.mailerlite_group_ids[1:]:
                        mailerlite_service.add_subscriber_to_group(email, group_id)
                if not result:
                    return Response(
                        {'error': 'Failed to create subscriber'}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            
            return Response({
                'success': True,
                'message': 'Subscriber created successfully',
                'next_step': 'business_type'
            })
        
        elif step == 'business_type':
            # Step 2: Update existing subscriber with business type
            if not email:
                return Response(
                    {'error': 'Email is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set the appropriate field values based on business type
            if business_type == 'implement':
                uses_automation_in_their_business = 1
                sells_AI_services = 0
            elif business_type == 'sell_services':
                uses_automation_in_their_business = 0
                sells_AI_services = 1
            else:
                return Response(
                    {'error': 'Invalid business type'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update in MailerLite with the specific fields
            result = mailerlite_service.update_subscriber(
                email, 
                uses_automation_in_their_business=uses_automation_in_their_business,
                sells_AI_services=sells_AI_services
            )
            
            if not result:
                return Response(
                    {'error': 'Failed to update subscriber'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            return Response({
                'success': True,
                'message': 'Business type updated successfully',
                'template': landing_page.template_content,
                'completed': True
            })
        
        else:
            return Response(
                {'error': 'Invalid step'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
                
    except Exception as e:
        logger.error(f"Error processing landing page submission: {str(e)}")
        return Response(
            {'error': 'An error occurred processing your submission'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

