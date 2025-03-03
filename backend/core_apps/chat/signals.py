import logging

from django.db.models.signals import m2m_changed, post_delete, post_save
from django.dispatch import receiver

from core_apps.apartments.models import Apartment
from core_apps.chat.models import ChatApartment

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Apartment)
def create_chat_for_apartment(sender, instance, created, **kwargs):
    if created:
        chat = ChatApartment.objects.create(apartment=instance)
        chat.members.add(instance.owner)

        logger.info(f"Chat created for apartment {instance.id}, owner added.")


@receiver(m2m_changed, sender=Apartment.tenants.through)
def update_tenants_in_chat(sender, instance, action, pk_set, **kwargs):
    chat = ChatApartment.objects.filter(apartment=instance).first()
    if not chat:
        return

    if action == "post_add":
        chat.members.add(*pk_set)
    elif action == "post_remove":
        chat.members.remove(*pk_set)

    logger.info(f"Tenants updated in chat for apartment {instance.id}.")
