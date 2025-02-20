# Generated by Django 5.1.3 on 2025-02-16 15:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("issues", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="issue",
            name="assigned_to",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_to_issues",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Assigned to",
            ),
        ),
        migrations.AddField(
            model_name="issue",
            name="reported_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reported_by_issues",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Reported by",
            ),
        ),
    ]
