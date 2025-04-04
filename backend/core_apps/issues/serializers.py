import logging

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework import serializers

from core_apps.apartments.models import Apartment
from core_apps.apartments.serializers import ApartmentSerializer
from core_apps.common.models import ContentView

from .emails import send_resolution_email
from .models import Issue

logger = logging.getLogger(__name__)

User = get_user_model()


class ApartmentForIssueSerializer(ApartmentSerializer):
    class Meta:  # type: ignore
        model = Apartment
        fields = [
            "id",
            "street",
            "building_number",
            "apartment_number",
            "city",
            "postal_code",
            "country",
            "owner",
        ]


class IssueSerializer(serializers.ModelSerializer):
    apartment_unit = ApartmentForIssueSerializer(source="apartment", read_only=True)
    reported_by = serializers.ReadOnlyField(source="reported_by.get_user_full_name")
    assigned_to = serializers.ReadOnlyField(source="assigned_to.get_user_full_name")
    view_count = serializers.SerializerMethodField()

    class Meta:
        model = Issue
        fields = [
            "id",
            "apartment_unit",
            "reported_by",
            "assigned_to",
            "title",
            "description",
            "status",
            "priority",
            "estimated_repair_date",
            "repair_duration",
            "view_count",
        ]
        read_only_fields = [
            "id",
            "apartment_unit",
            "reported_by",
            "assigned_to",
            "view_count",
        ]

    def get_view_count(self, obj) -> int:
        content_type = ContentType.objects.get_for_model(obj)
        return ContentView.objects.filter(
            content_type=content_type, object_id=obj.pkid
        ).count()


class IssueStatusUpdateSerializer(serializers.ModelSerializer):
    apartment = serializers.ReadOnlyField(source="apartment.unit_number")
    reported_by = serializers.ReadOnlyField(source="reported_by.get_user_full_name")
    resolved_by = serializers.ReadOnlyField(source="assigned_to.get_user_full_name")
    assigned_to = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Issue
        fields = [
            "title",
            "description",
            "apartment",
            "reported_by",
            "status",
            "resolved_by",
            "resolved_on",
            "assigned_to",
            "estimated_repair_date",
            "repair_duration",
        ]
        read_only_fields = [
            "id",
            "view_count",
        ]

    def update(self, instance: Issue, validated_data: dict) -> Issue:
        assigned_username = validated_data.pop("assigned_to", None)
        if assigned_username:
            try:
                assigned_user = User.objects.get(username=assigned_username)
                instance.assigned_to = assigned_user
            except User.DoesNotExist:
                raise serializers.ValidationError({"assigned_to": "User not found."})

        if (
            validated_data.get("status") == Issue.IssueStatus.RESOLVED
            and instance.status != Issue.IssueStatus.RESOLVED
        ):
            instance.resolved_on = timezone.now().date()
            send_resolution_email(instance)

        return super().update(instance, validated_data)
