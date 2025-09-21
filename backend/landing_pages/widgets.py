from django import forms
from django.utils.html import format_html
from django.urls import reverse
from .mailerlite_service import MailerLiteService


class MailerLiteGroupMultiSelectWidget(forms.CheckboxSelectMultiple):
    """Custom widget for selecting multiple MailerLite groups with refresh functionality"""
    
    def __init__(self, attrs=None, choices=()):
        super().__init__(attrs, choices)
        self.mailerlite_service = MailerLiteService()
    
    def render(self, name, value, attrs=None, renderer=None):
        # Get current groups from MailerLite
        groups = self.mailerlite_service.get_groups_for_admin()
        
        # Update choices with current groups
        self.choices = groups
        
        # Add empty option if no groups found
        if not groups:
            self.choices = [('', 'No groups found - check MailerLite API connection')]
        
        # Format the value properly for checkbox handling
        formatted_value = self.format_value(value)
        
        # Render the checkbox widget with proper value handling
        checkbox_html = super().render(name, formatted_value, attrs, renderer)
        
        # Wrap checkboxes in a multi-column grid layout
        styled_checkboxes = format_html(
            '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 8px; max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px; background: #f9f9f9;">{}</div>',
            checkbox_html
        )
        
        # Add refresh button
        refresh_button = format_html(
            '<button type="button" class="button" id="refresh-mailerlite-groups" '
            'style="margin-top: 10px;" title="Refresh groups from MailerLite">'
            '🔄 Refresh Groups</button>'
        )
        
        # Add JavaScript for refresh functionality
        js_code = format_html(
            '''
            <script>
            document.addEventListener('DOMContentLoaded', function() {{
                const refreshBtn = document.getElementById('refresh-mailerlite-groups');
                if (refreshBtn) {{
                    refreshBtn.addEventListener('click', function() {{
                        // Clear cache and reload page
                        fetch('{}', {{
                            method: 'POST',
                            headers: {{
                                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                                'Content-Type': 'application/json',
                            }},
                        }}).then(() => {{
                            location.reload();
                        }});
                    }});
                }}
            }});
            </script>
            ''',
            reverse('admin:landing_pages_landingpage_refresh_groups')
        )
        
        return format_html('{} {} {}', styled_checkboxes, refresh_button, js_code)
    
    def value_from_datadict(self, data, files, name):
        """Handle form submission data for multiple checkboxes"""
        # Get all values for this field name (checkbox inputs)
        values = data.getlist(name)
        # Filter out empty strings and return the list
        return [v for v in values if v]
    
    def format_value(self, value):
        """Format the value for display in the widget"""
        if value is None:
            return []
        if isinstance(value, str):
            try:
                import json
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return []
        if isinstance(value, list):
            return value
        return []


class MailerLiteGroupSelectWidget(forms.Select):
    """Custom widget for selecting MailerLite groups with refresh functionality"""
    
    def __init__(self, attrs=None, choices=()):
        super().__init__(attrs, choices)
        self.mailerlite_service = MailerLiteService()
    
    def render(self, name, value, attrs=None, renderer=None):
        # Get current groups from MailerLite
        groups = self.mailerlite_service.get_groups_for_admin()
        
        # Update choices with current groups
        self.choices = [('', 'Select a MailerLite Group...')] + groups
        
        # Add empty option if no groups found
        if not groups:
            self.choices = [('', 'No groups found - check MailerLite API connection')]
        
        # Render the select widget
        select_html = super().render(name, value, attrs, renderer)
        
        # Add refresh button
        refresh_button = format_html(
            '<button type="button" class="button" id="refresh-mailerlite-groups" '
            'style="margin-left: 10px;" title="Refresh groups from MailerLite">'
            '🔄 Refresh Groups</button>'
        )
        
        # Add JavaScript for refresh functionality
        js_code = format_html(
            '''
            <script>
            document.addEventListener('DOMContentLoaded', function() {{
                const refreshBtn = document.getElementById('refresh-mailerlite-groups');
                if (refreshBtn) {{
                    refreshBtn.addEventListener('click', function() {{
                        // Clear cache and reload page
                        fetch('{}', {{
                            method: 'POST',
                            headers: {{
                                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                                'Content-Type': 'application/json',
                            }},
                        }}).then(() => {{
                            location.reload();
                        }});
                    }});
                }}
            }});
            </script>
            ''',
            reverse('admin:landing_pages_landingpage_refresh_groups')
        )
        
        return format_html('{} {} {}', select_html, refresh_button, js_code)
