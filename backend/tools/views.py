from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Tool
from .serializers import ToolSerializer
from decouple import config
import boto3
from botocore.client import Config as BotoConfig
from datetime import datetime
import os


class ToolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tool.objects.filter(show_on_site=True)
    serializer_class = ToolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pricing', 'is_featured', 'categories', 'show_on_site']
    search_fields = ['name', 'description', 'external_id']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at', 'name']

    def _get_s3_client(self):
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
            config=BotoConfig(signature_version='s3v4')
        )

    def _build_public_url(self, bucket: str, key: str) -> str:
        cdn_base = config('SPACES_CDN_BASE', default='')
        if cdn_base:
            return f"{cdn_base.rstrip('/')}/{key}"
        region = config('SPACES_REGION')
        return f"https://{bucket}.{region}.digitaloceanspaces.com/{key}"

    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        """Upload image file via backend to Spaces and save image_url on Tool."""
        try:
            tool = self.get_queryset().get(pk=pk)
        except Tool.DoesNotExist:
            return Response({'error': 'Tool not found'}, status=status.HTTP_404_NOT_FOUND)

        upload_file = request.FILES.get('file')
        if not upload_file:
            return Response({'error': 'Missing file in form-data as "file"'}, status=status.HTTP_400_BAD_REQUEST)

        bucket = config('SPACES_BUCKET')
        # sanitize filename
        orig_name = os.path.basename(upload_file.name)
        timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%S')
        key = f"tools/images/{tool.id}/{timestamp}-{orig_name}"

        content_type = getattr(upload_file, 'content_type', 'application/octet-stream')

        try:
            s3 = self._get_s3_client()
            s3.put_object(
                Bucket=bucket,
                Key=key,
                Body=upload_file.read(),
                ContentType=content_type,
                ACL='public-read'
            )

            public_url = self._build_public_url(bucket, key)
            tool.image_url = public_url
            tool.save(update_fields=['image_url', 'updated_at'])

            return Response({'image_url': public_url, 'bucket': bucket, 'key': key})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
