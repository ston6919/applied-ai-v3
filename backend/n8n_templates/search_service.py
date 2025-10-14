import os
from openai import OpenAI
import requests
from decouple import config
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class TemplateSearchService:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=config('OPENAI_API_KEY'))
        
        # Pinecone HTTP API settings
        self.pinecone_url = 'https://n8ntemplates-18pj5g5.svc.aped-4627-b74a.pinecone.io/query'
        self.pinecone_api_key = config('PINECONE_API_KEY')
        
    def get_embedding(self, text: str) -> tuple[List[float], Dict[str, Any]]:
        """Get embedding for text using OpenAI - returns embedding and debug info"""
        try:
            # Log request
            request_info = {
                "model": "text-embedding-3-small",
                "input": text
            }
            
            response = self.openai_client.embeddings.create(
                input=text,
                model="text-embedding-3-small"
            )
            
            # Log response
            response_info = {
                "embedding_length": len(response.data[0].embedding),
                "model": response.model,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "embedding_vector": response.data[0].embedding  # Include actual vector
            }
            
            debug_info = {
                "openai_request": request_info,
                "openai_response": response_info
            }
            
            return response.data[0].embedding, debug_info
        except Exception as e:
            logger.error(f"Error getting embedding: {e}")
            raise
    
    def search_templates(self, query: str, top_k: int = 10) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Search for templates using RAG - returns template IDs from Pinecone metadata and debug info"""
        try:
            # Get embedding for the query
            query_embedding, openai_debug = self.get_embedding(query)
            
            # Prepare Pinecone HTTP request
            headers = {
                'Content-Type': 'application/json',
                'Api-Key': self.pinecone_api_key
            }
            
            payload = {
                "vector": query_embedding,
                "topK": top_k,
                "includeMetadata": True,
                "includeValues": False
            }
            
            # Log Pinecone request
            pinecone_request = {
                "vector_length": len(query_embedding),
                "top_k": top_k,
                "include_metadata": True
            }
            
            # Make HTTP request to Pinecone
            response = requests.post(
                self.pinecone_url,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            
            search_results = response.json()
            
            # Log Pinecone response
            matches = search_results.get('matches', [])
            pinecone_response = {
                "matches_count": len(matches),
                "matches": [
                    {
                        "id": match.get('id'),
                        "score": match.get('score'),
                        "template_id": match.get('metadata', {}).get('templateID')
                    }
                    for match in matches
                ]
            }
            
            # Format results - extract template IDs from metadata
            results = []
            for match in matches:
                template_id = match.get('metadata', {}).get('templateID')
                if template_id:  # Only include matches with a templateID
                    result = {
                        'external_id': template_id,  # This is the external_id to match in the database
                        'score': match.get('score'),
                        'metadata': match.get('metadata', {})
                    }
                    results.append(result)
            
            # Combine debug info
            debug_info = {
                **openai_debug,
                "pinecone_request": pinecone_request,
                "pinecone_response": pinecone_response
            }
            
            return results, debug_info
            
        except Exception as e:
            logger.error(f"Error searching templates: {e}")
            raise
