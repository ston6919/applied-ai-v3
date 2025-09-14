"""
URL configuration for applied_ai project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/news/', include('news.urls')),
    path('api/tools/', include('tools.urls')),
    path('api/automations/', include('automations.urls')),
    path('api/mastermind/', include('mastermind.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
