from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core_apps.issues.models import Issue

from .models import Apartment, RentalContract

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]


class IssueForApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id", "title", "description", "status", "priority", "resolved_on"]


class ApartmentForRentalContractSerializer(serializers.ModelSerializer):
    owner = UserSerializer(required=False, read_only=True)

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
        ]


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


class RentalContractSerializer(serializers.ModelSerializer):
    apartment = ApartmentForRentalContractSerializer(required=False, read_only=True)
    apartment_id = serializers.UUIDField(write_only=True)
    owner = UserSerializer(required=False, read_only=True)

    class Meta:
        model = RentalContract
        fields = [
            "id",
            "apartment",
            "apartment_id",
            "owner",
            "tenant",
            "start_date",
            "end_date",
            "rent_amount",
            "deposit",
            "status",
        ]
        read_only_fields = ["id", "apartment", "owner"]

    def to_internal_value(self, data):
        if "apartment_id" in data:
            try:
                apartment = Apartment.objects.get(id=data["apartment_id"])
                data["apartment_id"] = apartment.pkid
            except Apartment.DoesNotExist:
                raise ValidationError(
                    {"apartment": "Apartment with this UUID does not exist."}
                )

        return super().to_internal_value(data)
