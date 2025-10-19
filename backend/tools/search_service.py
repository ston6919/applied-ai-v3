import os
from openai import OpenAI
import requests
from decouple import config
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ToolSearchService:
    def __init__(self):
        # Initialize OpenAI client
        self.openai_client = OpenAI(api_key=config('OPENAI_API_KEY'))
        
        # Pinecone HTTP API settings
        self.pinecone_url = 'https://ai-tools-live-18pj5g5.svc.aped-4627-b74a.pinecone.io/query'
        self.pinecone_api_key = config('PINECONE_API_KEY')
        
    def get_embedding(self, text: str) -> tuple[List[float], Dict[str, Any]]:
        """Get embedding for text using OpenAI - returns embedding and debug info"""
        try:
            print(f"[ToolSearchService] Getting embedding for text: '{text[:100]}...'")
            # Log request
            request_info = {
                "model": "text-embedding-3-small",
                "input": text
            }
            
            response = self.openai_client.embeddings.create(
                input=text,
                model="text-embedding-3-small"
            )
            embedding_vector = response.data[0].embedding
            print(f"[ToolSearchService] ✅ OpenAI embedding received, length: {len(embedding_vector)}")
            print(f"[ToolSearchService] Full embedding vector: {embedding_vector}")
            print(f"[ToolSearchService] First 10 values: {embedding_vector[:10]}")
            print(f"[ToolSearchService] Last 10 values: {embedding_vector[-10:]}")
            
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
            print(f"[ToolSearchService] ❌ Error getting embedding: {e}")
            logger.error(f"Error getting embedding: {e}")
            raise
    
    def search_tools(self, query: str, top_k: int = 10) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Search for tools using RAG - returns tool IDs from Pinecone metadata and debug info"""
        try:
            print(f"[ToolSearchService] Searching tools for query: '{query}', top_k: {top_k}")
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
            
            print(f"[ToolSearchService] Posting to Pinecone URL: {self.pinecone_url}")
            print(f"[ToolSearchService] Request payload keys: {list(payload.keys())}")
            print(f"[ToolSearchService] Vector length in payload: {len(payload['vector'])}")
            print(f"[ToolSearchService] topK: {payload['topK']}")
            print(f"[ToolSearchService] includeMetadata: {payload['includeMetadata']}")
            
            # Show the exact API call being made
            print(f"[ToolSearchService] 🔥 EXACT PINECONE API CALL:")
            print(f"[ToolSearchService] URL: {self.pinecone_url}")
            print(f"[ToolSearchService] Headers: {headers}")
            print(f"[ToolSearchService] Payload: {payload}")
            print(f"[ToolSearchService] Full vector (first 10): {payload['vector'][:10]}")
            print(f"[ToolSearchService] Full vector (last 10): {payload['vector'][-10:]}")
            
            # Make HTTP request to Pinecone
            response = requests.post(
                self.pinecone_url,
                headers=headers,
                json=payload
            )
            print(f"[ToolSearchService] Pinecone response status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"[ToolSearchService] ❌ Pinecone error response: {response.text}")
                print(f"[ToolSearchService] ❌ Full error response: {response.content}")
            
            response.raise_for_status()
            
            search_results = response.json()
            print(f"[ToolSearchService] 🔥 PINECONE RESPONSE:")
            print(f"[ToolSearchService] Status: {response.status_code}")
            print(f"[ToolSearchService] Raw response: {search_results}")
            print(f"[ToolSearchService] Number of matches: {len(search_results.get('matches', []))}")
            
            # Show each match in detail
            matches = search_results.get('matches', [])
            if matches:
                print(f"[ToolSearchService] 📋 MATCHES FOUND:")
                for i, match in enumerate(matches):
                    print(f"[ToolSearchService] Match {i+1}:")
                    print(f"[ToolSearchService]   - ID: {match.get('id')}")
                    print(f"[ToolSearchService]   - Score: {match.get('score')}")
                    print(f"[ToolSearchService]   - Metadata: {match.get('metadata', {})}")
                    print(f"[ToolSearchService]   - toolID: {match.get('metadata', {}).get('toolID')}")
            else:
                print(f"[ToolSearchService] ❌ NO MATCHES FOUND IN PINECONE INDEX!")
                print(f"[ToolSearchService] This means the index is empty or has no similar vectors")
            
            # Log Pinecone response
            matches = search_results.get('matches', [])
            print(f"[ToolSearchService] Processing {len(matches)} matches from Pinecone")
            
            if len(matches) == 0:
                print("[ToolSearchService] ⚠️ WARNING: Pinecone returned ZERO matches!")
                print(f"[ToolSearchService] Search query was: '{query}'")
                print(f"[ToolSearchService] Full Pinecone response: {search_results}")
            
            pinecone_response = {
                "matches_count": len(matches),
                "matches": [
                    {
                        "id": match.get('id'),
                        "score": match.get('score'),
                        "tool_id": match.get('metadata', {}).get('toolID')
                    }
                    for match in matches
                ]
            }
            
            # Format results - extract tool IDs from metadata
            results = []
            for match in matches:
                tool_id = match.get('metadata', {}).get('toolID')
                if tool_id:  # Only include matches with a toolID
                    result = {
                        'external_id': tool_id,  # This is the external_id to match in the database
                        'score': match.get('score'),
                        'metadata': match.get('metadata', {})
                    }
                    results.append(result)
                    print(f"[ToolSearchService] Match: toolID={tool_id}, score={match.get('score')}")
                else:
                    print(f"[ToolSearchService] ⚠️ Warning: Match has no toolID in metadata: {match.get('metadata', {})}")
            
            print(f"[ToolSearchService] ✅ Returning {len(results)} results")
            # Combine debug info
            debug_info = {
                **openai_debug,
                "pinecone_request": pinecone_request,
                "pinecone_response": pinecone_response
            }
            
            return results, debug_info
            
        except Exception as e:
            print(f"[ToolSearchService] ❌ Error searching tools: {e}")
            import traceback
            print(f"[ToolSearchService] Traceback:\n{traceback.format_exc()}")
            logger.error(f"Error searching tools: {e}")
            raise

