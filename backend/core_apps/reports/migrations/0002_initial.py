# Generated by Django 5.1.3 on 2025-02-16 15:31

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("reports", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name="report",
            name="reported_by",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reports_made",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Reported by",
            ),
        ),
        migrations.AddField(
            model_name="report",
            name="reported_user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reports_received",
                to=settings.AUTH_USER_MODEL,
                verbose_name="Reported user",
            ),
        ),
    ]
