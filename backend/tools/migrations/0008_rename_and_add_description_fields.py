# Generated manually for renaming description to short_description and adding new description field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0007_alter_tool_features_alter_tool_new_features'),
    ]

    operations = [
        # Step 1: Rename existing description to short_description
        migrations.RenameField(
            model_name='tool',
            old_name='description',
            new_name='short_description',
        ),
        # Step 2: Add new description field
        migrations.AddField(
            model_name='tool',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
    ]

