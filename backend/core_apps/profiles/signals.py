import logging
from typing import Any, Type

from config.settings.base import AUTH_USER_MODEL
from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver

from core_apps.profiles.models import Occupation, Profile
from core_apps.users.models import User

logger = logging.getLogger(__name__)


@receiver(post_save, sender=AUTH_USER_MODEL)
def create__user_profile(
    sender: Type[User], instance: User, created: bool, **kwargs: Any
) -> None:
    if created:
        Profile.objects.create(user=instance)
        # logger.info(
        #     f"User profile created for user {instance.first_name} {instance.last_name}"
        # )
    else:
        # logger.info(f"Profile already exists for user {instance.first_name}")
        pass


@receiver(post_migrate)
def populate_occupations(sender, **kwargs):
    if sender.name == "core_apps.profiles":  # Only populate if the app is installed
        for choice in Occupation.OccupationChoices.choices:
            name = choice[0]
            if not Occupation.objects.filter(name=name).exists():
                Occupation.objects.create(name=name)
                # logger.info(f"Occupation {name} created.")
