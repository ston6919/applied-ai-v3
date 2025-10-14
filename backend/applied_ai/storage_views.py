from decouple import config
import boto3
from botocore.client import Config
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt


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
                public_url = f"{cdn_base.rstrip('/')}/{object_key}"
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


