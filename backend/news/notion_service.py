import logging
from django.conf import settings
from notion_client import Client
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


class NotionService:
    def __init__(self):
        self.api_token = getattr(settings, 'NOTION_API_TOKEN', None)
        self.database_id = getattr(settings, 'NOTION_DATABASE_ID', None)
        
        if self.api_token:
            self.client = Client(auth=self.api_token)
        else:
            self.client = None
            logger.warning("Notion API token not configured")

    def add_story_to_reading_list(
        self, 
        title: str, 
        first_url: Optional[str] = None,
        additional_sources: Optional[str] = None
    ) -> Optional[Dict]:
        """
        Add a news story to the Notion reading list database.
        
        Args:
            title: The story title (goes to "Name" property)
            first_url: The first source URL (goes to "URL" property)
            additional_sources: Additional sources info (goes to "Additional Info" property)
        
        Returns:
            Dict with the created page data, or None if failed
        """
        if not self.api_token:
            logger.error("Notion API token not configured")
            return None
        
        if not self.database_id:
            logger.error("Notion database ID not configured")
            return None
        
        if not self.client:
            logger.error("Notion client not initialized")
            return None
        
        try:
            # Build the properties for the database page
            properties = {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": title
                            }
                        }
                    ]
                }
            }
            
            # Add URL if provided
            if first_url:
                properties["URL"] = {
                    "url": first_url
                }
            
            # Add additional info if provided
            if additional_sources:
                properties["Additional Info"] = {
                    "rich_text": [
                        {
                            "text": {
                                "content": additional_sources
                            }
                        }
                    ]
                }
            
            # Create the page in the database
            response = self.client.pages.create(
                parent={"database_id": self.database_id},
                properties=properties
            )
            
            logger.info(f"Successfully added story '{title}' to Notion reading list")
            return response
            
        except Exception as e:
            logger.error(f"Error adding story to Notion: {str(e)}", exc_info=True)
            return None

