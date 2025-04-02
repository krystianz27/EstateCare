import uuid

from django.contrib.auth import get_user_model
from django.db import models

from core_apps.apartments.models import Apartment

User = get_user_model()


class ChatApartment(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    apartment = models.ForeignKey(
        Apartment, on_delete=models.CASCADE, related_name="chat"
    )
    members = models.ManyToManyField(User, related_name="apartment_chats")
    # members = models.ManyToManyField(
    #     User, through="ChatMember", related_name="apartment_chats"
    # )

    def __str__(self):
        return f"Chat for Apartment {self.apartment.id}"


# class ChatMember(models.Model):
#     chat = models.ForeignKey(ChatApartment, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)


class MessageApartment(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    chat = models.ForeignKey(
        ChatApartment, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="apartment_messages"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.chat} at {self.created_at}"


class Message(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.created_at}"
