from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import Coalesce
from django.db.models import F, DateTimeField
from .models import Tool
from .serializers import ToolSerializer
from .search_service import ToolSearchService
from decouple import config
import boto3
from botocore.client import Config as BotoConfig
from datetime import datetime
import os


class ToolViewSet(viewsets.ModelViewSet):
    queryset = Tool.objects.filter(show_on_site=True)
    serializer_class = ToolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pricing', 'is_featured', 'categories', 'show_on_site']
    search_fields = ['name', 'description', 'external_id']
    ordering_fields = ['updated_at', 'created_at', 'name', 'table_order']
    ordering = ['-created_at', 'name']
    
    def filter_queryset(self, queryset):
        """Override to handle manual ordering and combined date sorting"""
        # Check if manual ordering is requested (for table view)
        ordering_param = self.request.query_params.get('ordering', '')
        
        if ordering_param == 'manual':
            # Apply filters but not ordering
            queryset = super().filter_queryset(queryset)
            # Then apply manual ordering
            return queryset.order_by('table_order', 'name')
        
        elif ordering_param == '-updated_at':
            # Apply filters first
            queryset = super().filter_queryset(queryset)
            # Sort by last_updated if set, otherwise by updated_at (most recent first)
            return queryset.annotate(
                effective_date=Coalesce('last_updated', 'updated_at', output_field=DateTimeField())
            ).order_by('-effective_date', 'name')
        
        # Default behavior with standard filters and ordering
        return super().filter_queryset(queryset)

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

    @action(detail=False, methods=['post'])
    def search(self, request):
        """RAG-based search using OpenAI embeddings and Pinecone, or return all tools if query is empty"""
        query = request.data.get('query', '').strip()
        print(f"[Tools Search] Received search request with query: '{query}'")
        
        # If query is empty, return all tools
        if not query:
            print("[Tools Search] Empty query - returning all tools")
            tools = Tool.objects.filter(show_on_site=True).order_by('-created_at', 'name')
            results = []
            for tool in tools:
                serializer = self.get_serializer(tool)
                results.append({
                    'tool': serializer.data,
                    'relevance_score': None,  # No relevance score for non-search results
                    'metadata': {}
                })
            
            return Response({
                'query': '',
                'results': results,
                'total': len(results),
                'debug': {'message': 'Returned all tools (no search query provided)'}
            })
        
        debug_info = {}
        try:
            print("[Tools Search] Initializing ToolSearchService")
            search_service = ToolSearchService()
            
            # Get embedding first (this will populate debug_info even if Pinecone fails)
            print("[Tools Search] Getting embedding from OpenAI")
            query_embedding, openai_debug = search_service.get_embedding(query)
            debug_info.update(openai_debug)
            print(f"[Tools Search] Embedding generated, length: {len(query_embedding)}")
            print(f"[Tools Search] Embedding vector (first 10): {query_embedding[:10]}")
            print(f"[Tools Search] Embedding vector (last 10): {query_embedding[-10:]}")
            
            # Now do the Pinecone search
            print("[Tools Search] Querying Pinecone")
            search_results, full_debug_info = search_service.search_tools(query, top_k=10)
            debug_info = full_debug_info  # Replace with full debug info if successful
            print(f"[Tools Search] Pinecone returned {len(search_results)} results")
            
            # Get external IDs from search results
            external_ids = [result['external_id'] for result in search_results]
            print(f"[Tools Search] External IDs from Pinecone: {external_ids}")

            # Fetch tools from database using the external_id from Pinecone
            tools = Tool.objects.filter(
                external_id__in=external_ids,
                show_on_site=True
            )
            print(f"[Tools Search] Found {tools.count()} tools in database matching external IDs")

            # Create a mapping of external_id to tool
            tool_map = {str(tool.external_id): tool for tool in tools}
            print(f"[Tools Search] Tool map keys: {list(tool_map.keys())}")

            # Order results by search score from Pinecone
            ordered_results = []
            for result in search_results:
                external_id = str(result['external_id'])  # Ensure string comparison
                if external_id in tool_map:
                    tool = tool_map[external_id]
                    serializer = self.get_serializer(tool)
                    ordered_results.append({
                        'tool': serializer.data,
                        'relevance_score': result['score'],
                        'metadata': result.get('metadata', {})
                    })
                    print(f"[Tools Search] Added tool: {tool.name} (score: {result['score']})")
                else:
                    print(f"[Tools Search] ⚠️ Warning: External ID {external_id} from Pinecone not found in database")

            print(f"[Tools Search] ✅ Returning {len(ordered_results)} ordered results")
            return Response({
                'query': query,
                'results': ordered_results,
                'total': len(ordered_results),
                'debug': debug_info
            })
            
        except Exception as e:
            print(f"[Tools Search] ❌ ERROR: {str(e)}")
            print(f"[Tools Search] Exception type: {type(e).__name__}")
            import traceback
            print(f"[Tools Search] Traceback:\n{traceback.format_exc()}")
            return Response(
                {
                    'error': f'Search failed: {str(e)}',
                    'debug': debug_info  # Return whatever debug info we collected before the error
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'], url_path='reorder')
    def reorder(self, request, pk=None):
        """
        Reorder a tool to a new position.
        Expects: {"new_position": <int>}
        """
        try:
            tool = Tool.objects.get(pk=pk)
            new_position = request.data.get('new_position')
            
            if new_position is None:
                return Response(
                    {'error': 'new_position is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            new_position = int(new_position)
            old_position = tool.table_order
            
            # Get all tools ordered by table_order
            tools = list(Tool.objects.all().order_by('table_order', 'id'))
            
            # Remove the tool from its current position
            tools = [t for t in tools if t.id != tool.id]
            
            # Insert at new position
            tools.insert(new_position, tool)
            
            # Update table_order for all tools
            for idx, t in enumerate(tools):
                t.table_order = idx
                t.save(update_fields=['table_order'])
            
            return Response({
                'message': f'Tool "{tool.name}" moved to position {new_position}',
                'old_position': old_position,
                'new_position': new_position
            })
            
        except Tool.DoesNotExist:
            return Response(
                {'error': 'Tool not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return Response(
                {'error': 'new_position must be an integer'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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
