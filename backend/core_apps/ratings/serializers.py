from django.contrib.auth import get_user_model
from rest_framework import serializers

from core_apps.profiles.models import Profile

from .models import Rating

User = get_user_model()


class RatingSerializer(serializers.ModelSerializer):
    rated_user_username = serializers.CharField(write_only=True)

    class Meta:
        model = Rating
        fields = ["id", "rated_user_username", "rating", "comment"]
        read_only_fields = ["id", "rating_user"]

    def validate(self, attrs):
        rating_user = self.context["request"].user
        rated_user_username = attrs["rated_user_username"]

        try:
            rated_user = User.objects.get(username=rated_user_username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this username does not exist.")

        self.validate_users(rating_user, rated_user)

        queryset = Rating.objects.filter(rating_user=rating_user, rated_user=rated_user)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "You have already rated this user. You cannot rate the same user multiple times."
            )

        self.validate_occupations(rating_user, rated_user)

        attrs["rated_user"] = rated_user
        del attrs["rated_user_username"]

        return attrs

    def validate_users(self, rating_user, rated_user):

        if rating_user == rated_user:
            raise serializers.ValidationError("You cannot review yourself.")

        if not hasattr(rating_user, "profile") or not hasattr(rated_user, "profile"):
            raise serializers.ValidationError("Both users must have a valid profile.")

        return rated_user

    def validate_occupations(self, rating_user, rated_user):
        rating_user_occupation = rating_user.profile.occupation
        rated_user_occupation = rated_user.profile.occupation

        if (
            rating_user_occupation == Profile.Occupation.TENANT
            and rated_user_occupation == Profile.Occupation.TENANT
        ):
            raise serializers.ValidationError("A tenant cannot review another tenant.")

        allowed_occupations = [
            choice[0]
            for choice in Profile.Occupation.choices
            if choice[0] != Profile.Occupation.TENANT
        ]

        if (
            rating_user_occupation == Profile.Occupation.TENANT
            and rated_user_occupation not in allowed_occupations
        ):
            raise serializers.ValidationError(
                "A tenant can only review technicians and not other tenants!"
            )

        if (
            rating_user_occupation != Profile.Occupation.TENANT
            and rated_user_occupation != Profile.Occupation.TENANT
        ):
            raise serializers.ValidationError(
                "A technician cannot review another technician."
            )
        if (
            rating_user_occupation != Profile.Occupation.TENANT
            and rated_user_occupation == Profile.Occupation.TENANT
        ):
            raise serializers.ValidationError(
                "A technician cannot review another tenant."
            )

    # def create(self, validated_data):
    #     return Rating.objects.create(
    #         rating_user=self.context["request"].user, **validated_data
    #     )
