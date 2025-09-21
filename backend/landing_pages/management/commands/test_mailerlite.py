from django.core.management.base import BaseCommand
from landing_pages.mailerlite_service import MailerLiteService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Test MailerLite API connection and list groups'

    def handle(self, *args, **options):
        self.stdout.write("Testing MailerLite API connection...")
        
        mailerlite_service = MailerLiteService()
        
        # Check API key
        if not mailerlite_service.api_key:
            self.stdout.write(
                self.style.ERROR("❌ MailerLite API key is not configured!")
            )
            self.stdout.write("Please add MAILERLITE_API_KEY to your .env file")
            return
        
        self.stdout.write(
            self.style.SUCCESS(f"✅ API key configured: {mailerlite_service.api_key[:10]}...")
        )
        
        # Test basic connection
        self.stdout.write("Testing API connection...")
        try:
            response = mailerlite_service.get_groups()
            
            if response is None:
                self.stdout.write(
                    self.style.ERROR("❌ Failed to connect to MailerLite API")
                )
                return
            
            self.stdout.write(
                self.style.SUCCESS("✅ Successfully connected to MailerLite API")
            )
            
            # Check response structure
            if not isinstance(response, dict):
                self.stdout.write(
                    self.style.ERROR(f"❌ Unexpected response type: {type(response)}")
                )
                return
            
            if 'data' not in response:
                self.stdout.write(
                    self.style.ERROR(f"❌ Response missing 'data' field. Keys: {list(response.keys())}")
                )
                return
            
            groups = response['data']
            if not groups:
                self.stdout.write(
                    self.style.WARNING("⚠️  No groups found in your MailerLite account")
                )
                self.stdout.write("You may need to create groups in your MailerLite dashboard")
                return
            
            # Display groups
            self.stdout.write(
                self.style.SUCCESS(f"✅ Found {len(groups)} groups:")
            )
            
            for group in groups:
                group_id = group.get('id', 'N/A')
                group_name = group.get('name', 'Unnamed Group')
                self.stdout.write(f"  - {group_name} (ID: {group_id})")
            
            # Test admin formatting
            admin_groups = mailerlite_service.get_groups_for_admin()
            self.stdout.write(f"\nAdmin formatted groups: {len(admin_groups)}")
            for group_id, display_name in admin_groups:
                self.stdout.write(f"  - {display_name}")
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error testing MailerLite connection: {str(e)}")
            )
            import traceback
            self.stdout.write(traceback.format_exc())
