from django_countries.serializer_fields import CountryField
from rest_framework import serializers

from core_apps.apartments.models import Apartment
from core_apps.apartments.serializers import ApartmentSerializer

from .models import Occupation, Profile


class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Occupation
        fields = ["id", "name"]


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    username = serializers.ReadOnlyField(source="user.username")
    full_name = serializers.ReadOnlyField(source="user.get_user_full_name")
    country_of_origin = CountryField(name_only=True)
    avatar = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    apartment = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    occupations = OccupationSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "slug",
            "first_name",
            "last_name",
            "username",
            "full_name",
            "phone_number",
            "gender",
            "country_of_origin",
            "city_of_origin",
            "bio",
            "occupations",
            "reputation",
            "date_joined",
            "avatar",
            "apartment",
            "average_rating",
        ]

    def get_avatar(self, obj: Profile) -> str | None:
        try:
            return obj.avatar.url
        except AttributeError:
            return None

    def get_apartment(self, obj: Profile) -> dict | list | None:
        apartment = obj.user.owned_apartments.first()  # type: ignore
        if apartment:
            return ApartmentSerializer(apartment).data
        return None

    def get_average_rating(self, obj: Profile) -> float:
        return obj.get_average_rating()


class UpdateProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    username = serializers.CharField(source="user.username")
    country_of_origin = CountryField(name_only=True)
    occupations = OccupationSerializer(many=True, read_only=True)
    occupations_input = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    class Meta:
        model = Profile
        fields = [
            "first_name",
            "last_name",
            "username",
            "gender",
            "country_of_origin",
            "city_of_origin",
            "bio",
            "occupations",
            "occupations_input",
            "phone_number",
        ]

    def update(self, instance, validated_data):
        occupations_data = validated_data.pop("occupations_input", None)
        print(occupations_data)
        if occupations_data is not None:
            if occupations_data.strip() == "":
                instance.occupations.clear()
            else:
                occupations_list = [
                    occupation.strip() for occupation in occupations_data.split(",")
                ]
                occupations = Occupation.objects.filter(name__in=occupations_list)
                if len(occupations) != len(occupations_list):
                    raise serializers.ValidationError("Some occupations do not exist.")
                instance.occupations.set(occupations)

        return super().update(instance, validated_data)


class AvatarUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["avatar"]


class ApartmentForTenantSerializer(ApartmentSerializer):
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
            # "owner",
        ]


class TenantSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField(source="user.first_name")
    last_name = serializers.ReadOnlyField(source="user.last_name")
    username = serializers.ReadOnlyField(source="user.username")
    full_name = serializers.ReadOnlyField(source="user.get_user_full_name")
    country_of_origin = CountryField(name_only=True)
    avatar = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    apartment = serializers.SerializerMethodField()
    # apartment = ApartmentForTenantSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "full_name",
            "phone_number",
            "gender",
            "country_of_origin",
            "city_of_origin",
            "date_joined",
            "avatar",
            "apartment",
        ]

    def get_avatar(self, obj: Profile) -> str | None:
        try:
            return obj.avatar.url
        except AttributeError:
            return None

    def get_apartment(self, obj: Profile) -> dict | None:
        first_apartment = obj.user.rented_apartments.first()  # type: ignore
        if first_apartment:
            return ApartmentForTenantSerializer(first_apartment).data
        return None
