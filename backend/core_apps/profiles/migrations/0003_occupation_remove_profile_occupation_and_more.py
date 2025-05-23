# Generated by Django 5.1.3 on 2025-03-15 12:57

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profiles", "0002_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Occupation",
            fields=[
                (
                    "pkid",
                    models.BigAutoField(
                        editable=False, primary_key=True, serialize=False
                    ),
                ),
                (
                    "id",
                    models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "name",
                    models.CharField(
                        choices=[
                            ("plumber", "Plumber"),
                            ("electrician", "Electrician"),
                            ("hvac", "HVAC"),
                            ("locksmith", "Locksmith"),
                            ("handyman", "Handyman"),
                            ("appliance_repair", "Appliance Repair Technician"),
                            ("tenant", "Tenant"),
                            ("owner", "Owner"),
                        ],
                        default="tenant",
                        max_length=20,
                        unique=True,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at", "-updated_at"],
                "abstract": False,
            },
        ),
        migrations.RemoveField(
            model_name="profile",
            name="occupation",
        ),
        migrations.AddField(
            model_name="profile",
            name="occupations",
            field=models.ManyToManyField(
                blank=True,
                null=True,
                to="profiles.occupation",
                verbose_name="Occupations",
            ),
        ),
    ]
