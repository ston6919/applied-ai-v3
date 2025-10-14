from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import N8nTemplate
from .serializers import N8nTemplateSerializer
from .search_service import TemplateSearchService


class N8nTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = N8nTemplate.objects.filter(available_on_website=True)
    serializer_class = N8nTemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'score', 'created_at']
    ordering = ['-score', 'name']
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        """RAG-based search using OpenAI embeddings and Pinecone, or return all templates if query is empty"""
        query = request.data.get('query', '').strip()
        
        # If query is empty, return all templates
        if not query:
            templates = N8nTemplate.objects.filter(available_on_website=True).order_by('-score', 'name')
            results = []
            for template in templates:
                serializer = self.get_serializer(template)
                results.append({
                    'template': serializer.data,
                    'relevance_score': None,  # No relevance score for non-search results
                    'metadata': {}
                })
            
            return Response({
                'query': '',
                'results': results,
                'total': len(results),
                'debug': {'message': 'Returned all templates (no search query provided)'}
            })
        
        debug_info = {}
        try:
            search_service = TemplateSearchService()
            
            # Get embedding first (this will populate debug_info even if Pinecone fails)
            query_embedding, openai_debug = search_service.get_embedding(query)
            debug_info.update(openai_debug)
            
            # Now do the Pinecone search
            search_results, full_debug_info = search_service.search_templates(query, top_k=10)
            debug_info = full_debug_info  # Replace with full debug info if successful
            
            # Get external IDs from search results
            external_ids = [result['external_id'] for result in search_results]
            
            # Fetch templates from database using the external_id from Pinecone
            templates = N8nTemplate.objects.filter(
                external_id__in=external_ids,
                available_on_website=True
            )
            
            # Create a mapping of external_id to template
            template_map = {str(template.external_id): template for template in templates}
            
            # Order results by search score from Pinecone
            ordered_results = []
            for result in search_results:
                external_id = str(result['external_id'])  # Ensure string comparison
                if external_id in template_map:
                    template = template_map[external_id]
                    serializer = self.get_serializer(template)
                    ordered_results.append({
                        'template': serializer.data,
                        'relevance_score': result['score'],
                        'metadata': result.get('metadata', {})
                    })
            
            return Response({
                'query': query,
                'results': ordered_results,
                'total': len(ordered_results),
                'debug': debug_info
            })
            
        except Exception as e:
            return Response(
                {
                    'error': f'Search failed: {str(e)}',
                    'debug': debug_info  # Return whatever debug info we collected before the error
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )