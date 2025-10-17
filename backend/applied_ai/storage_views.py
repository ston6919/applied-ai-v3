from decouple import config
import boto3
from botocore.client import Config
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import UploadedFile
import os
import re
import logging

logger = logging.getLogger(__name__)


def _get_s3_client():
    endpoint_url = config('SPACES_ENDPOINT')
    region_name = config('SPACES_REGION')
    access_key = config('SPACES_KEY')
    secret_key = config('SPACES_SECRET')

    session = boto3.session.Session()
    return session.client(
        's3',
        region_name=region_name,
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        config=Config(signature_version='s3v4')
    )


def _sanitize_filename(filename):
    """
    Sanitize filename to prevent path traversal and other security issues.
    Removes directory separators and keeps only safe characters.
    """
    # Get just the basename to prevent path traversal
    filename = os.path.basename(filename)
    
    # Remove any remaining path separators
    filename = filename.replace('/', '').replace('\\', '')
    
    # Allow only alphanumeric, dots, dashes, underscores
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Remove leading dots to prevent hidden files
    filename = filename.lstrip('.')
    
    # Ensure filename isn't empty
    if not filename:
        filename = 'unnamed_file'
    
    return filename


def _validate_file_upload(file_obj, max_size_mb=50):
    """
    Validate uploaded file for security.
    Returns (is_valid, error_message)
    """
    # Check file size
    max_size = max_size_mb * 1024 * 1024  # Convert to bytes
    if file_obj.size > max_size:
        return False, f'File too large. Maximum size is {max_size_mb}MB'
    
    # Check if file is empty
    if file_obj.size == 0:
        return False, 'File is empty'
    
    return True, None


def _validate_acl(acl):
    """
    Validate ACL parameter to prevent unauthorized access patterns.
    """
    allowed_acls = ['public-read', 'private', 'authenticated-read']
    return acl in allowed_acls


def _check_authorization(request):
    """
    Check if the request has a valid Bearer token.
    Returns (is_authorized, error_message)
    """
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header:
        return False, 'Authorization header required'
    
    # Check if it starts with "Bearer "
    if not auth_header.startswith('Bearer '):
        return False, 'Invalid authorization format. Use: Bearer {token}'
    
    # Extract the token
    token = auth_header[7:]  # Remove "Bearer " prefix
    
    # Get the expected token from environment
    expected_token = config('STORAGE_UPLOAD_TOKEN', default='')
    
    if not expected_token:
        logger.error('STORAGE_UPLOAD_TOKEN not configured in environment')
        return False, 'Server configuration error'
    
    # Compare tokens
    if token != expected_token:
        return False, 'Invalid authorization token'
    
    return True, None


@csrf_exempt
@require_http_methods(["POST"])
def create_presigned_put(request):
    # Expect JSON body: { key: "path/filename.ext", contentType: "mime/type", acl?: "public-read" }
    try:
        data = request.json if hasattr(request, 'json') else None
    except Exception:
        data = None

    if not data:
        try:
            import json
            data = json.loads(request.body or b"{}")
        except Exception:
            data = {}

    object_key = (data or {}).get('key')
    content_type = (data or {}).get('contentType', 'application/octet-stream')
    acl = (data or {}).get('acl')  # e.g., 'public-read' or None for private

    if not object_key:
        return JsonResponse({'error': 'Missing key'}, status=400)

    bucket = config('SPACES_BUCKET')

    params = {
        'Bucket': bucket,
        'Key': object_key,
    }

    # Headers that must match on client PUT
    fields = {}
    conditions = []

    if content_type:
        params['ContentType'] = content_type

    if acl:
        params['ACL'] = acl

    try:
        s3 = _get_s3_client()
        url = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params=params,
            ExpiresIn=300  # 5 minutes
        )
        # Also provide a suggested public URL if ACL is public-read and CDN base exists
        cdn_base = config('SPACES_CDN_BASE', default='')
        public_url = None
        if acl == 'public-read':
            if cdn_base:
                # CDN URL includes bucket in path: https://cdn.example.com/bucket-name/file.jpg
                public_url = f"{cdn_base.rstrip('/')}/{bucket}/{object_key}"
            else:
                region = config('SPACES_REGION')
                bucket_host = f"https://{bucket}.{region}.digitaloceanspaces.com"
                public_url = f"{bucket_host}/{object_key}"

        return JsonResponse({
            'url': url,
            'headers': {
                'Content-Type': content_type
            },
            'publicUrl': public_url,
            'bucket': bucket,
            'key': object_key
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def upload_file(request):
    """
    Upload a file directly to Digital Ocean Spaces.
    Expects:
    - Authorization: Bearer {token} header
    - file: binary file data (multipart/form-data)
    - filename: name for the file in the Space
    - acl: (optional) 'public-read' or 'private' (default: 'public-read')
    
    Security features:
    - Bearer token authentication
    - File size validation (max 50MB)
    - Filename sanitization (prevents path traversal)
    - ACL validation
    - Error logging without exposing internals
    """
    try:
        # Check authorization
        is_authorized, auth_error = _check_authorization(request)
        if not is_authorized:
            return JsonResponse({'error': auth_error}, status=401)
        
        # Get the file from the request
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file provided'}, status=400)
        
        file_obj = request.FILES['file']
        
        # Validate file
        is_valid, error_msg = _validate_file_upload(file_obj, max_size_mb=50)
        if not is_valid:
            return JsonResponse({'error': error_msg}, status=400)
        
        # Get the filename from POST data or use the uploaded file's name
        filename = request.POST.get('filename', file_obj.name)
        
        if not filename:
            return JsonResponse({'error': 'Filename is required'}, status=400)
        
        # Sanitize filename to prevent path traversal and other security issues
        filename = _sanitize_filename(filename)
        
        # Get ACL setting (default to public-read)
        acl = request.POST.get('acl', 'public-read')
        
        # Validate ACL
        if not _validate_acl(acl):
            return JsonResponse({
                'error': 'Invalid ACL. Allowed values: public-read, private, authenticated-read'
            }, status=400)
        
        # Get content type
        content_type = file_obj.content_type or 'application/octet-stream'
        
        # Get the S3 client and bucket
        s3 = _get_s3_client()
        bucket = config('SPACES_BUCKET')
        
        # Upload the file using chunked reading to avoid memory issues
        # For files uploaded via Django, we can use the file object directly
        s3.put_object(
            Bucket=bucket,
            Key=filename,
            Body=file_obj,
            ContentType=content_type,
            ACL=acl
        )
        
        # Generate the public URL (only return if public-read)
        public_url = None
        if acl == 'public-read':
            cdn_base = config('SPACES_CDN_BASE', default='')
            if cdn_base:
                # CDN URL includes bucket in path: https://cdn.example.com/bucket-name/file.jpg
                public_url = f"{cdn_base.rstrip('/')}/{bucket}/{filename}"
            else:
                region = config('SPACES_REGION')
                bucket_host = f"https://{bucket}.{region}.digitaloceanspaces.com"
                public_url = f"{bucket_host}/{filename}"
        
        return JsonResponse({
            'success': True,
            'message': 'File uploaded successfully',
            'filename': filename,
            'url': public_url,
            'contentType': content_type
        })
        
    except Exception as e:
        # Log the actual error for debugging but don't expose details to client
        logger.error(f"File upload error: {str(e)}", exc_info=True)
        return JsonResponse({
            'error': 'An error occurred during file upload. Please try again.'
        }, status=500)


