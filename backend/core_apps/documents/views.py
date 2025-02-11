from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from core_apps.common.renderers import GenericJSONRenderer
from core_apps.documents.permissions import (
    CanCreateAndListDocuments,
    IsDocumentOwner,
    IsDocumentOwnerOrSharedWith,
)

from .models import Document
from .serializers import DocumentSerializer

User = get_user_model()


class DocumentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, CanCreateAndListDocuments]
    renderer_classes = [GenericJSONRenderer]
    object_label = "document"

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    def get_queryset(self) -> QuerySet[Document]:  # type: ignore
        filter_type = self.request.query_params.get("type", "owned")  # type: ignore

        if filter_type not in [
            "owned",
            "shared",
        ]:
            raise ValidationError("Invalid filter type. Use 'owned' or 'shared'.")

        if filter_type == "shared":
            return self.queryset.filter(shared_with=self.request.user)
        else:
            return self.queryset.filter(uploaded_by=self.request.user)


class DocumentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDocumentOwnerOrSharedWith]
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    object_label = "document"

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )


class DocumentShareAPIView(generics.GenericAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDocumentOwner]
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    object_label = "document"

    def get_queryset(self) -> QuerySet[Document]:  # type: ignore
        return Document.objects.filter(uploaded_by=self.request.user)

    def post(self, request, id=None):
        document = self.get_object()

        users_uuid_list = request.data.get("shared_with", [])

        if not users_uuid_list:
            return Response(
                {"detail": "No users specified to share with."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_pkid_list = list(
            User.objects.filter(id__in=users_uuid_list).values_list("pkid", flat=True)
        )

        document.shared_with.add(*user_pkid_list)
        document.save()

        return Response(self.get_serializer(document).data, status=status.HTTP_200_OK)


class DocumentRevokeShareAPIView(generics.GenericAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsDocumentOwner]
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    object_label = "document"

    def get_queryset(self) -> QuerySet[Document]:  # type: ignore
        return Document.objects.filter(uploaded_by=self.request.user)

    def post(self, request, id=None):
        document = self.get_object()

        users_uuid_list = request.data.get("shared_with", [])

        if not users_uuid_list:
            return Response(
                {"detail": "No users specified to revoke access."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_pkid_list = list(
            User.objects.filter(id__in=users_uuid_list).values_list("pkid", flat=True)
        )

        document.shared_with.remove(*user_pkid_list)
        document.save()

        return Response(
            {"detail": "Access to the document has been revoked successfully."},
            status=status.HTTP_200_OK,
        )
