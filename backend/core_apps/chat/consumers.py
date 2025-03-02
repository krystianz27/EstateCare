import json
from uuid import UUID

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from core_apps.chat.serializers import MessageApartmentSerializer

from .models import ChatApartment, Message, MessageApartment

User = get_user_model()


class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender = self.scope["user"]

        if sender.is_anonymous:
            await self.close()

        self.receiver_id = self.scope["url_route"]["kwargs"]["receiver_id"]
        print(self.receiver_id)
        print(sender.id)
        self.receiver_id = UUID(self.receiver_id)

        self.room_group_name = f"private_chat_{min(sender.id, self.receiver_id)}_{max(sender.id, self.receiver_id)}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)  # type: ignore
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)  # type: ignore

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            sender = self.scope["user"]
            message = data["message"]

            receiver = await self.get_user(self.receiver_id)

            new_message = Message(sender=sender, receiver=receiver, content=message)
            await self.save_message(new_message)

            await self.channel_layer.group_send(  # type: ignore
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": str(sender.id),
                    "receiver": str(receiver.id),
                },
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @database_sync_to_async
    def save_message(self, message):
        return message.save()


class ApartmentChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender = self.scope["user"]
        print(sender)
        if sender.is_anonymous:
            await self.close()
            print("Anonymous")

        self.apartment_id = self.scope["url_route"]["kwargs"]["apartment_id"]
        self.room_group_name = f"apartment_chat_{self.apartment_id}"

        if not await self.user_is_resident(sender, self.apartment_id):
            print("USER IS NOT RESIDENT")
            await self.close()

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)  # type: ignore
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)  # type: ignore

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            data = json.loads(text_data)
            sender = self.scope["user"]
            message = data["message"]

            chat = await self.get_chat(self.apartment_id)
            if not chat:
                await self.close()
                return

            new_message = MessageApartment(chat=chat, sender=sender, content=message)
            saved_message = await self.save_message(new_message)
            message_data = await self.serialize_message(saved_message)

            # Send message to all users in group chat
            await self.channel_layer.group_send(  # type: ignore
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_data": message_data,
                    # "message": message,
                    # "sender": str(sender.id),
                },
            )
        elif bytes_data:
            pass

    async def chat_message(self, event):
        message_data = event["message_data"]
        await self.send(text_data=json.dumps(message_data))

    # async def chat_message(self, event):
    #     sender_id = event["sender"]
    #     sender = await self.get_user(sender_id)

    #     message_obj = await self.get_message(event["message_id"])

    #     sender_data = {
    #         "uuid": str(sender.id),
    #         "username": sender.username,
    #         "avatar": sender.profile.avatar.url if sender.profile.avatar else None,
    #     }

    #     message_data = {
    #         "message": event["message"],
    #         "sender": sender_data,
    #         "created_at": message_obj.created_at.strftime("%Y-%m-%d %H:%M:%S"),
    #         "read": message_obj.read,
    #     }

    #     await self.send(text_data=json.dumps(message_data))

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_message(self, message_id):
        try:
            return MessageApartment.objects.get(id=message_id)
        except MessageApartment.DoesNotExist:
            return None

    @database_sync_to_async
    def get_chat(self, apartment_id):
        return ChatApartment.objects.filter(apartment__id=apartment_id).first()

    @database_sync_to_async
    def save_message(self, message):
        message.save()
        return message

    @database_sync_to_async
    def serialize_message(self, message):
        serializer = MessageApartmentSerializer(message)
        return serializer.data

    # FIX THIS LATER
    # @database_sync_to_async
    # def user_is_resident(self, user, apartment_id):
    #     return ChatApartment.objects.filter(
    #         # apartment__id=apartment_id, members=user
    #         apartment__id=apartment_id
    #     ).exists()
    @database_sync_to_async
    def user_is_resident(self, user, apartment_id):
        return True
