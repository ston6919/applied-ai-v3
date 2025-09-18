"""
Production settings for applied_ai project.
"""

from .settings import *
import os
from decouple import config
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# ALLOWED_HOSTS is now handled in base settings.py
# Debug: Print ALLOWED_HOSTS to logs
print(f"ALLOWED_HOSTS: {ALLOWED_HOSTS}")

# Add WhiteNoise middleware for static files
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Database (use DATABASE_URL provided by the platform)
# Example: postgres://USER:PASSWORD@HOST:PORT/NAME
DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}

# CORS settings for production
# Get CORS allowed origins from environment variable
cors_origins = config('CORS_ALLOWED_ORIGINS', default='')
if cors_origins:
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins.split(',')]
else:
    # Fallback to FRONTEND_URL if CORS_ALLOWED_ORIGINS is not set
    frontend_url = config('FRONTEND_URL', default='https://www.its-applied-ai.com')
    CORS_ALLOWED_ORIGINS = [frontend_url]

# Allow all origins if no specific origins are configured (for development)
if not CORS_ALLOWED_ORIGINS or CORS_ALLOWED_ORIGINS == ['']:
    CORS_ALLOW_ALL_ORIGINS = True

# Debug: Print CORS settings to logs
print(f"CORS_ALLOWED_ORIGINS: {CORS_ALLOWED_ORIGINS}")
print(f"CORS_ALLOW_ALL_ORIGINS: {CORS_ALLOW_ALL_ORIGINS}")

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Use WhiteNoise to serve static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
