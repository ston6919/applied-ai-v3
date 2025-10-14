from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["POST"])
def contact_form(request):
    """
    Handle contact form submissions
    """
    try:
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['name', 'email', 'message', 'type']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'error': f'{field.capitalize()} is required'
                }, status=400)
        
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        inquiry_type = data.get('type')
        
        # Compose email
        subject = f'New Contact Form Submission: {inquiry_type}'
        email_message = f"""
New contact form submission from Applied AI Website:

Name: {name}
Email: {email}
Type: {inquiry_type}

Message:
{message}

---
This message was sent from the Applied AI contact form.
        """
        
        # Send email
        try:
            send_mail(
                subject=subject,
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['matt@matt-penny.com'],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return JsonResponse({
                'error': 'Failed to send message. Please try again later.'
            }, status=500)
        
        return JsonResponse({
            'message': 'Your message has been sent successfully!'
        }, status=200)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return JsonResponse({
            'error': 'An error occurred. Please try again later.'
        }, status=500)
