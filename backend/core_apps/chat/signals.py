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
    if action.startswith("pre_"):
        return

    chat = ChatApartment.objects.filter(apartment=instance).first()
    logger.info(
        f"Signal triggered for action: {action}, sender: {sender}, instance: {instance.id}, pk_set: {pk_set}"
    )

    if not chat:
        return

    # if action == 'post_add' and not instance.tenants.filter(pkid__in=pk_set).exists():
    if action == "post_add":
        chat.members.add(*pk_set)
    elif action == "post_remove":
        chat.members.remove(*pk_set)

    logger.info(f"Tenants updated in chat for apartment {instance.id}.")
