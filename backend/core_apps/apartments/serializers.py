from django.contrib.auth import get_user_model
from rest_framework import serializers

from core_apps.issues.models import Issue

from .models import Apartment

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]


class IssueForApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id", "title", "description", "status", "priority", "resolved_on"]


class ApartmentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(required=False, read_only=True)
    tenants = UserSerializer(many=True, required=False, read_only=True)
    issues = IssueForApartmentSerializer(many=True, read_only=True)

    class Meta:
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
            "tenants",
            "issues",
        ]


class AddDeleteTenantSerializer(serializers.ModelSerializer):
    add = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )
    remove = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )

    class Meta:
        model = Apartment
        fields = ["add", "remove"]
