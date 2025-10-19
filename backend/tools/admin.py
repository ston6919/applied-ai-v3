from django.contrib import admin
from django import forms
from .models import Tool, Category
from decouple import config
from urllib.parse import quote
class PreviewFileInput(forms.ClearableFileInput):
    def render(self, name, value, attrs=None, renderer=None):
        input_html = super().render(name, value, attrs=attrs, renderer=renderer)
        input_id = (attrs or {}).get('id', f'id_{name}')
        preview_id = f'{input_id}_preview'
        current_url = ''
        if attrs and attrs.get('data-current-url'):
            current_url = attrs.get('data-current-url')

        display_style = 'block' if current_url else 'none'
        preview_img_html = (
            f'<div style="margin-top:8px">'
            f'<img id="{preview_id}" src="{current_url}" '
            f'style="max-width:240px; max-height:160px; display:{display_style}; '
            f'border:1px solid #eee; padding:4px; background:#fafafa" />'
            f'</div>'
        )
        script = f"""
<script>
(function(){{
  var input = document.getElementById('{input_id}');
  if (!input) return;
  var preview = document.getElementById('{preview_id}');
  function showPreview(file) {{
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {{
      preview.src = e.target.result;
      preview.style.display = 'block';
    }};
    reader.readAsDataURL(file);
  }}
  input.addEventListener('change', function(ev) {{
    if (input.files && input.files[0]) {{
      showPreview(input.files[0]);
    }}
  }});
}})();
</script>
"""
        return input_html + preview_img_html + script

import boto3
from botocore.client import Config as BotoConfig
from datetime import datetime
import os


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'pricing', 'is_featured', 'show_on_site', 'date_added']
    list_filter = ['pricing', 'is_featured', 'show_on_site', 'categories']
    search_fields = ['name', 'short_description', 'description', 'external_id']
    filter_horizontal = ['categories']
    ordering = ['-created_at', 'name']
    # Allow manual editing of image_url

    class ToolAdminForm(forms.ModelForm):
        image_file = forms.FileField(required=False, help_text='Upload an image to store in Spaces and set image URL.', widget=PreviewFileInput)
        # Override model URLField with a CharField so we can normalize/encode before validation
        image_url = forms.CharField(required=False)
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            # Pass current image URL to the widget for initial preview
            instance = getattr(self, 'instance', None)
            if instance and getattr(instance, 'image_url', ''):
                self.fields['image_file'].widget.attrs['data-current-url'] = instance.image_url

        def clean_image_url(self):
            url = (self.cleaned_data.get('image_url') or '').strip()
            if not url:
                return url
            try:
                from urllib.parse import urlsplit, urlunsplit, quote, urlencode, parse_qsl
                parts = urlsplit(url)
                # Encode path and keep common safe chars
                path = quote(parts.path, safe='/-_.~')
                # Preserve existing query params
                query = urlencode(parse_qsl(parts.query, keep_blank_values=True), doseq=True)
                normalized = urlunsplit((parts.scheme, parts.netloc, path, query, parts.fragment))
                return normalized
            except Exception:
                # Fall back to original; admin will still show validation error if truly broken
                return url

        class Meta:
            model = Tool
            fields = '__all__'

        def _get_s3_client(self):
            session = boto3.session.Session()
            return session.client(
                's3',
                region_name=config('SPACES_REGION'),
                endpoint_url=config('SPACES_ENDPOINT'),
                aws_access_key_id=config('SPACES_KEY'),
                aws_secret_access_key=config('SPACES_SECRET'),
                config=BotoConfig(signature_version='s3v4')
            )

        def _build_public_url(self, bucket: str, key: str) -> str:
            # Encode path to ensure a valid URL (spaces, unicode, etc.)
            encoded_key = quote(key, safe="/-_.~")
            cdn_base = config('SPACES_CDN_BASE', default='')
            if cdn_base:
                return f"{cdn_base.rstrip('/')}/applied-ai/{encoded_key}"
            region = config('SPACES_REGION')
            base = f"https://{bucket}.{region}.digitaloceanspaces.com"
            return f"{base}/applied-ai/{encoded_key}"

        def save(self, commit=True):
            instance = super().save(commit=False)
            upload = self.files.get('image_file')
            if upload:
                bucket = config('SPACES_BUCKET')
                orig_name = os.path.basename(upload.name)
                timestamp = datetime.utcnow().strftime('%Y%m%dT%H%M%S')
                # Use a temporary key if instance not yet saved with id
                tool_id = instance.id or 'new'
                key = f"tools/images/{tool_id}/{timestamp}-{orig_name}"
                content_type = getattr(upload, 'content_type', 'application/octet-stream')

                s3 = self._get_s3_client()
                s3.put_object(
                    Bucket=bucket,
                    Key=key,
                    Body=upload.read(),
                    ContentType=content_type,
                    ACL='public-read'
                )
                instance.image_url = self._build_public_url(bucket, key)

            if commit:
                instance.save()
                # If we uploaded before instance had an id, re-upload under final id for tidy structure
                if upload and tool_id == 'new' and instance.id:
                    # Move by copying to new key and deleting old
                    new_key = key.replace('/new/', f'/{instance.id}/')
                    s3 = self._get_s3_client()
                    bucket = config('SPACES_BUCKET')
                    s3.copy_object(Bucket=bucket, CopySource={'Bucket': bucket, 'Key': key}, Key=new_key, ACL='public-read', ContentType=content_type)
                    s3.delete_object(Bucket=bucket, Key=key)
                    instance.image_url = self._build_public_url(bucket, new_key)
                    instance.save(update_fields=['image_url'])
            return instance

    form = ToolAdminForm

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'short_description', 'description', 'features', 'new_features')
        }),
        ('Image', {
            'fields': ('image_file', 'image_url'),
            'description': 'Upload an image file to store in Spaces. image_url will be set automatically.'
        }),
        ('URLs', {
            'fields': ('website_url', 'source_url')
        }),
        ('Settings', {
            'fields': ('pricing', 'is_featured', 'show_on_site', 'external_id', 'date_added', 'last_updated')
        }),
        ('Categories', {
            'fields': ('categories',)
        }),
    )
