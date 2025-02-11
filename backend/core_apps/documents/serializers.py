from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    uploaded_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    uploaded_by_user_data = serializers.SerializerMethodField()
    shared_with_users = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "created_at",
            "file",
            "file_url",
            "uploaded_by",
            "uploaded_by_user_data",
            "apartment",
            "shared_with_users",
        ]
        read_only_fields = [
            "id",
            "uploaded_by",
            "created_at",
            "updated_at",
            "file_url",
        ]

    # def validate_file(self, value):
    #     if not value.name.endswith((".pdf", ".doc", ".docx", ".jpg", ".png")):
    #         raise serializers.ValidationError(
    #             "Unsupported file type. Please upload a PDF, DOC, or image."
    #         )
    #     return value

    def get_uploaded_by_user_data(self, obj) -> dict[str, str]:
        return {
            "id": str(obj.uploaded_by.id),
            "username": obj.uploaded_by.username,
            "full_name": obj.uploaded_by.get_user_full_name,
        }

    def get_shared_with_users(self, obj) -> list[dict[str, str]]:
        return [
            {
                "id": str(user.id),
                # "username": user.username,
                # "full_name": user.get_user_full_name,
            }
            for user in obj.shared_with.all()
        ]

    def get_file_url(self, obj) -> str:
        return obj.file.url
