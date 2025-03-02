from rest_framework import serializers

from .models import Message, MessageApartment


class MessageApartmentSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # type: ignore

    class Meta:
        model = MessageApartment
        fields = ["sender", "content", "created_at", "read"]

    def get_sender(self, obj):
        return {
            "uuid": str(obj.sender.id),
            "username": obj.sender.username,
            "avatar": obj.sender.profile.avatar.url
            if obj.sender.profile.avatar
            else None,
        }


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # type: ignore

    class Meta:
        model = Message
        fields = ["sender", "content", "created_at", "read"]

    def get_sender(self, obj):
        return {
            "uuid": str(obj.sender.id),
            "username": obj.sender.username,
            "avatar": obj.sender.profile.avatar.url
            if obj.sender.profile.avatar
            else None,
        }
