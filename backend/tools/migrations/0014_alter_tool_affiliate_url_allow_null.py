# Generated manually to allow NULL values for affiliate_url

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0013_alter_tool_pricing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tool',
            name='affiliate_url',
            field=models.URLField(blank=True, default='', null=True, verbose_name='Affiliate URL'),
        ),
    ]
