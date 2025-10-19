# Generated manually to clean external_id data before field change

from django.db import migrations, models


def clean_external_id(apps, schema_editor):
    """Clean external_id field by setting 'NaN' and empty string values to NULL"""
    Tool = apps.get_model('tools', 'Tool')
    # Update records where external_id is 'NaN' or empty string
    Tool.objects.filter(external_id__in=['NaN', '']).update(external_id=None)
    print(f"Cleaned external_id field: set 'NaN' and empty values to NULL")


def reverse_clean_external_id(apps, schema_editor):
    """No need to reverse this data cleaning operation"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('tools', '0008_rename_and_add_description_fields'),
    ]

    operations = [
        migrations.RunPython(clean_external_id, reverse_clean_external_id),
        migrations.AlterField(
            model_name='tool',
            name='external_id',
            field=models.IntegerField(blank=True, db_index=True, null=True),
        ),
    ]
