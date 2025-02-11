from django.contrib import admin
from django.db.models import CharField, Value
from django.db.models.functions import Concat
from django.db.models.query import QuerySet

from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "created_at",
        "title",
        "uploaded_by",
        "get_uploaded_by_full_name",
        "apartment",
        "get_shared_users_count",
    ]

    list_display_links = [
        "id",
        "title",
    ]
    list_filter = ["created_at", "uploaded_by", "apartment"]
    search_fields = [
        "title",
        "uploaded_by__first_name",
        "uploaded_by__email",
        "full_name",
    ]
    ordering = ["-created_at"]
    autocomplete_fields = ["uploaded_by", "apartment", "shared_with"]

    def get_queryset(self, request) -> QuerySet[Document]:  # type: ignore
        queryset = super().get_queryset(request)
        return queryset.annotate(
            full_name=Concat(
                "uploaded_by__first_name",
                Value(" "),
                "uploaded_by__last_name",
                output_field=CharField(),
            )
        )

    def get_uploaded_by_full_name(self, obj) -> str:
        return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}".strip()

    get_uploaded_by_full_name.short_description = "Uploaded By (Full Name)"  # type: ignore

    def get_shared_users_count(self, obj):
        return obj.shared_with.count()

    get_shared_users_count.short_description = "Shared With (Count)"  # type: ignore
