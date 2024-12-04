import logging
from typing import Any, Type

# from django.db.models.base import Model
from django.db.models.signals import post_save
from django.dispatch import receiver

from config.settings.base import AUTH_USER_MODEL
from core_apps.profiles.models import Profile
from core_apps.users.models import User

logger = logging.getLogger(__name__)


@receiver(post_save, sender=AUTH_USER_MODEL)
def create__user_profile(
    sender: Type[User], instance: User, created: bool, **kwargs: Any
) -> None:
    if created:
        Profile.objects.create(user=instance)
        logger.info(
            f"User profile created for user {instance.first_name} {instance.last_name}"
        )
    else:
        logger.info(f"Profile already exists for user {instance.first_name}")
