from django import forms
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import JSONField
from .models import LandingPage
from .mailerlite_service import MailerLiteService
from .widgets import MailerLiteGroupMultiSelectWidget


class MailerLiteGroupIdsField(forms.JSONField):
    """Custom field for handling MailerLite group IDs as a list"""
    
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('initial', [])
        super().__init__(*args, **kwargs)
    
    def to_python(self, value):
        """Convert value to Python list"""
        if value is None or value == '':
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            try:
                import json
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return []
        return []


class LandingPageForm(forms.ModelForm):
    """Custom form for LandingPage with MailerLite group validation"""
    
    mailerlite_group_ids = MailerLiteGroupIdsField(
        widget=MailerLiteGroupMultiSelectWidget(),
        required=False,
        help_text="Select one or more MailerLite groups for this landing page"
    )
    
    class Meta:
        model = LandingPage
        fields = '__all__'
    
    def clean_mailerlite_group_ids(self):
        """Validate that the selected group IDs exist in MailerLite"""
        group_ids = self.cleaned_data.get('mailerlite_group_ids')
        
        if not group_ids:
            return []  # Return empty list if no groups selected
        
        try:
            mailerlite_service = MailerLiteService()
            groups = mailerlite_service.get_groups_for_admin()
            
            # Check if the group IDs exist in the current groups
            valid_group_ids = [gid for gid, _ in groups]
            
            for group_id in group_ids:
                if group_id not in valid_group_ids:
                    raise ValidationError(
                        f'Group ID "{group_id}" not found in MailerLite. '
                        'Please refresh the groups list and try again.'
                    )
            
            return group_ids
            
        except Exception as e:
            raise ValidationError(
                f'Unable to validate group IDs with MailerLite: {str(e)}. '
                'Please check your API connection and try again.'
            )
