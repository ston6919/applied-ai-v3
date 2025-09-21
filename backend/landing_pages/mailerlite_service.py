import requests
import logging
from django.conf import settings
from django.core.cache import cache
from typing import Optional, Dict, Any, List, Tuple

logger = logging.getLogger(__name__)


class MailerLiteService:
    def __init__(self):
        self.api_key = getattr(settings, 'MAILERLITE_API_KEY', None)
        self.base_url = 'https://connect.mailerlite.com/api'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Optional[Dict]:
        """Make a request to MailerLite API"""
        if not self.api_key:
            logger.error("MailerLite API key not configured")
            return None

        url = f"{self.base_url}/{endpoint}"
        logger.info(f"Making {method} request to: {url}")
        logger.info(f"Headers: {self.headers}")
        if data:
            logger.info(f"Request data: {data}")
        
        try:
            response = requests.request(method, url, headers=self.headers, json=data, timeout=10)
            logger.info(f"Response status code: {response.status_code}")
            logger.info(f"Response headers: {dict(response.headers)}")
            
            if response.status_code in [200, 201]:
                response_data = response.json()
                logger.info(f"Response data: {response_data}")
                return response_data
            elif response.status_code == 404:
                logger.warning(f"MailerLite API endpoint not found: {endpoint}")
                logger.warning(f"Response text: {response.text}")
                return None
            elif response.status_code == 401:
                logger.error("MailerLite API authentication failed - check your API key")
                logger.error(f"Response text: {response.text}")
                return None
            elif response.status_code == 403:
                logger.error("MailerLite API access forbidden - check API key permissions")
                logger.error(f"Response text: {response.text}")
                return None
            else:
                logger.error(f"MailerLite API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"MailerLite API request failed: {str(e)}", exc_info=True)
            return None

    def get_subscriber(self, email: str) -> Optional[Dict]:
        """Get subscriber by email"""
        endpoint = f"subscribers/{email}"
        return self._make_request('GET', endpoint)

    def create_subscriber(self, email: str, group_id: str, first_name: str = None) -> Optional[Dict]:
        """Create a new subscriber"""
        endpoint = "subscribers"
        data = {
            'email': email,
            'groups': [group_id]
        }
        
        if first_name:
            data['fields'] = {
                'name': first_name
            }
        
        return self._make_request('POST', endpoint, data)

    def update_subscriber(self, email: str, first_name: str = None, business_type: str = None, uses_automation_in_their_business: int = None, sells_AI_services: int = None) -> Optional[Dict]:
        """Update subscriber information"""
        # First get the subscriber to find their ID
        subscriber = self.get_subscriber(email)
        if not subscriber:
            logger.error(f"Subscriber not found: {email}")
            return None
        
        subscriber_id = subscriber.get('data', {}).get('id')
        if not subscriber_id:
            logger.error(f"No ID found for subscriber: {email}")
            return None
            
        endpoint = f"subscribers/{subscriber_id}"
        data = {}
        
        if first_name:
            data['fields'] = {
                'name': first_name
            }
        
        if business_type:
            if 'fields' not in data:
                data['fields'] = {}
            data['fields']['business_type'] = business_type
        
        if uses_automation_in_their_business is not None:
            if 'fields' not in data:
                data['fields'] = {}
            data['fields']['uses_automation_in_their_business'] = uses_automation_in_their_business
        
        if sells_AI_services is not None:
            if 'fields' not in data:
                data['fields'] = {}
            data['fields']['sell_ai_services'] = sells_AI_services
        
        if not data:
            return None
            
        return self._make_request('PUT', endpoint, data)

    def add_subscriber_to_group(self, email: str, group_id: str) -> Optional[Dict]:
        """Add subscriber to a specific group"""
        endpoint = f"subscribers/{email}/groups/{group_id}"
        return self._make_request('POST', endpoint)

    def get_groups(self) -> Optional[Dict]:
        """Get all groups"""
        endpoint = "groups"
        return self._make_request('GET', endpoint)

    def get_groups_for_admin(self) -> List[Tuple[str, str]]:
        """
        Get groups formatted for admin dropdown selection.
        Returns list of tuples: (group_id, "Group Name (ID: group_id)")
        """
        cache_key = 'mailerlite_groups_admin'
        cached_groups = cache.get(cache_key)
        
        if cached_groups is not None:
            logger.info(f"Returning {len(cached_groups)} cached groups")
            return cached_groups
        
        # Debug API key
        if not self.api_key:
            logger.error("MailerLite API key is not configured")
            return []
        
        logger.info(f"API key configured: {self.api_key[:10]}...")
        logger.info(f"Base URL: {self.base_url}")
        
        try:
            response = self.get_groups()
            logger.info(f"Raw API response: {response}")
            
            if not response:
                logger.error("No response received from MailerLite API")
                return []
            
            if 'data' not in response:
                logger.error(f"Response missing 'data' field. Response keys: {list(response.keys()) if isinstance(response, dict) else 'Not a dict'}")
                return []
            
            if not response['data']:
                logger.warning("Empty groups data received from MailerLite API")
                return []
            
            groups = []
            for group in response['data']:
                group_id = str(group.get('id', ''))
                group_name = group.get('name', 'Unnamed Group')
                display_name = f"{group_name} (ID: {group_id})"
                groups.append((group_id, display_name))
                logger.info(f"Added group: {display_name}")
            
            logger.info(f"Successfully processed {len(groups)} groups")
            # Cache for 10 minutes
            cache.set(cache_key, groups, 600)
            return groups
            
        except Exception as e:
            logger.error(f"Error fetching groups for admin: {str(e)}", exc_info=True)
            return []

    def get_group_name_by_id(self, group_id: str) -> str:
        """Get group name by ID for display purposes"""
        if not group_id:
            return "No Group Selected"
        
        cache_key = f'mailerlite_group_name_{group_id}'
        cached_name = cache.get(cache_key)
        
        if cached_name is not None:
            return cached_name
        
        try:
            groups = self.get_groups_for_admin()
            for gid, display_name in groups:
                if gid == group_id:
                    # Extract just the group name from "Group Name (ID: 123)"
                    group_name = display_name.split(' (ID:')[0]
                    cache.set(cache_key, group_name, 600)
                    return group_name
            
            return f"Group ID: {group_id}"
            
        except Exception as e:
            logger.error(f"Error getting group name for ID {group_id}: {str(e)}")
            return f"Group ID: {group_id}"

    def clear_groups_cache(self):
        """Clear the groups cache to force refresh"""
        cache.delete('mailerlite_groups_admin')
        # Also clear individual group name caches
        cache.delete_many([key for key in cache._cache.keys() if key.startswith('mailerlite_group_name_')])
