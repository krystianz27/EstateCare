from django.contrib import admin
from django.db.models import CharField, Value
from django.db.models.functions import Concat
from django.db.models.query import QuerySet

from .models import ChatApartment, Message, MessageApartment


@admin.register(ChatApartment)
class ChatApartmentAdmin(admin.ModelAdmin):
    list_display = [
        "uuid",
        "apartment",
        "get_members_count",
    ]

    list_display_links = [
        "uuid",
        "apartment",
    ]
    list_filter = ["apartment"]
    search_fields = [
        "apartment__id",
    ]
    autocomplete_fields = ["apartment", "members"]

    def get_members_count(self, obj):
        return obj.members.count()

    get_members_count.short_description = "Members Count"  # type: ignore


@admin.register(MessageApartment)
class MessageApartmentAdmin(admin.ModelAdmin):
    list_display = [
        "uuid",
        "chat",
        "sender",
        "content",
        "created_at",
        "read",
    ]

    list_display_links = [
        "uuid",
        "chat",
    ]
    list_filter = ["created_at", "read", "sender"]
    search_fields = [
        "sender__email",
        "content",
    ]
    autocomplete_fields = ["chat", "sender"]

    def get_queryset(self, request) -> QuerySet[MessageApartment]:  # type: ignore
        queryset = super().get_queryset(request)
        return queryset.annotate(
            full_name=Concat(
                "sender__first_name",
                Value(" "),
                "sender__last_name",
                output_field=CharField(),
            )
        )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = [
        "uuid",
        "sender",
        "receiver",
        "content",
        "created_at",
        "read",
    ]

    list_display_links = [
        "uuid",
        "sender",
    ]
    list_filter = ["created_at", "read", "sender", "receiver"]
    search_fields = [
        "sender__email",
        "receiver__email",
        "content",
    ]
    autocomplete_fields = ["sender", "receiver"]

    def get_queryset(self, request) -> QuerySet[Message]:  # type: ignore
        queryset = super().get_queryset(request)
        return queryset.annotate(
            full_name=Concat(
                "sender__first_name",
                Value(" "),
                "sender__last_name",
                output_field=CharField(),
            )
        )
