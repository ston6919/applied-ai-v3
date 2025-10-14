"""
URL configuration for applied_ai project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from .storage_views import create_presigned_put

def api_root(request):
    return JsonResponse({
        'message': 'Applied AI API is running!',
        'endpoints': {
            'admin': '/admin/',
            'news': '/api/news/',
            'tools': '/api/tools/',
            'automations': '/api/automations/',
            'mastermind': '/api/mastermind/',
            'landing_pages': '/api/landing-pages/',
            'n8n_templates': '/api/n8n-templates/'
        }
    })

def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'message': 'Backend is running'
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/news/', include('news.urls')),
    path('api/tools/', include('tools.urls')),
    path('api/automations/', include('automations.urls')),
    path('api/mastermind/', include('mastermind.urls')),
    path('api/', include('landing_pages.urls')),
    path('api/n8n-templates/', include('n8n_templates.urls')),
    path('api/storage/presign', create_presigned_put, name='storage_presign'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
