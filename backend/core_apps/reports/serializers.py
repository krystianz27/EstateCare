from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Report

User = get_user_model()


class ReportSerializer(serializers.ModelSerializer):
    reported_user_username = serializers.CharField(write_only=True)

    class Meta:
        model = Report
        fields = ["id", "title", "description", "reported_user_username", "created_at"]

        def validate_reported_user_username(self, value: str):
            try:
                reported_user = User.objects.get(username=value)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    "The provided username does not exist"
                )
            return reported_user

    def create(self, validated_data: dict) -> Report:
        reported_user = validated_data.pop("reported_user_username")

        report = Report.objects.create(reported_user=reported_user, **validated_data)
        return report
