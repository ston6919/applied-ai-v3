from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from news.models import CanonicalNewsStory


class Command(BaseCommand):
    help = 'Create test canonical news stories with various ranks'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all existing stories before creating test data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            count = CanonicalNewsStory.objects.count()
            CanonicalNewsStory.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f'Deleted {count} existing stories')
            )

        # Get current time for event_time
        now = timezone.now()

        test_stories = [
            {
                'title': 'OpenAI Announces GPT-5 with Revolutionary Capabilities',
                'summary': 'OpenAI has unveiled GPT-5, featuring unprecedented reasoning abilities and multimodal understanding. The new model represents a significant leap forward in AI capabilities.',
                'status': 'ranked',
                'rank': 5,
                'event_time': now - timedelta(hours=2),
                'show_source': True,
            },
            {
                'title': 'Major Breakthrough in Quantum Computing Achieved',
                'summary': 'Scientists have achieved a new milestone in quantum computing, demonstrating error correction at scale. This breakthrough could accelerate the development of practical quantum computers.',
                'status': 'ranked',
                'rank': 5,
                'event_time': now - timedelta(hours=5),
                'show_source': True,
            },
            {
                'title': 'AI-Powered Medical Diagnosis Tool Shows 95% Accuracy',
                'summary': 'A new AI system for medical diagnosis has achieved 95% accuracy in clinical trials, potentially revolutionizing healthcare diagnostics and improving patient outcomes.',
                'status': 'ranked',
                'rank': 5,
                'event_time': now - timedelta(days=1),
                'show_source': False,
            },
            {
                'title': 'Tech Giants Form AI Safety Consortium',
                'summary': 'Leading technology companies have announced the formation of a new consortium focused on AI safety and responsible development practices.',
                'status': 'ranked',
                'rank': 4,
                'event_time': now - timedelta(hours=8),
                'show_source': True,
            },
            {
                'title': 'New AI Framework Simplifies Machine Learning Development',
                'summary': 'Researchers have released a new open-source framework that makes machine learning development more accessible to developers of all skill levels.',
                'status': 'ranked',
                'rank': 3,
                'event_time': now - timedelta(hours=12),
                'show_source': False,
            },
            {
                'title': 'AI Automation Saves Companies Millions in Operational Costs',
                'summary': 'A recent study shows that companies implementing AI automation have seen significant cost reductions and efficiency improvements across various industries.',
                'status': 'ranked',
                'rank': 3,
                'event_time': now - timedelta(days=2),
                'show_source': True,
            },
            {
                'title': 'Neural Networks Show Promise in Climate Modeling',
                'summary': 'Scientists are using advanced neural networks to improve climate prediction models, potentially providing more accurate forecasts for climate change impacts.',
                'status': 'ranked',
                'rank': 2,
                'event_time': now - timedelta(hours=18),
                'show_source': False,
            },
            {
                'title': 'AI Ethics Guidelines Updated by International Consortium',
                'summary': 'An international consortium has released updated guidelines for AI ethics, addressing concerns about bias, transparency, and accountability in AI systems.',
                'status': 'ranked',
                'rank': 2,
                'event_time': now - timedelta(days=3),
                'show_source': True,
            },
        ]

        created_count = 0
        for story_data in test_stories:
            story, created = CanonicalNewsStory.objects.get_or_create(
                title=story_data['title'],
                defaults=story_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created: {story.title} (Rank {story.rank})')
                )
            else:
                # Update existing story
                for key, value in story_data.items():
                    setattr(story, key, value)
                story.save()
                self.stdout.write(
                    self.style.WARNING(f'Updated: {story.title} (Rank {story.rank})')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully processed {len(test_stories)} stories '
                f'({created_count} created, {len(test_stories) - created_count} updated)'
            )
        )
        
        rank_5_count = CanonicalNewsStory.objects.filter(rank=5, status='ranked').count()
        self.stdout.write(
            self.style.SUCCESS(f'Total stories with rank 5: {rank_5_count}')
        )
