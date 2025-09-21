from django.core.management.base import BaseCommand
from landing_pages.models import LandingPage


class Command(BaseCommand):
    help = 'Create a new landing page'

    def add_arguments(self, parser):
        parser.add_argument('title', type=str, help='Title of the landing page')
        parser.add_argument('slug', type=str, help='URL slug for the landing page')
        parser.add_argument('--description', type=str, help='Description of the landing page')
        parser.add_argument('--template', type=str, help='Template content to deliver')
        parser.add_argument('--group-id', type=str, help='MailerLite group ID')

    def handle(self, *args, **options):
        title = options['title']
        slug = options['slug']
        description = options.get('description', '')
        template_content = options.get('template', 'Your template content will appear here.')
        group_id = options.get('group_id', '')

        landing_page, created = LandingPage.objects.get_or_create(
            slug=slug,
            defaults={
                'title': title,
                'description': description,
                'template_content': template_content,
                'mailerlite_group_id': group_id,
                'is_active': True
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created landing page: {title}')
            )
            self.stdout.write(f'URL: http://localhost:3010/landing/{slug}')
        else:
            self.stdout.write(
                self.style.WARNING(f'Landing page with slug "{slug}" already exists')
            )
