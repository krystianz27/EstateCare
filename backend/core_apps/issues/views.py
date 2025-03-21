import logging

from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied, ValidationError

from core_apps.apartments.models import Apartment
from core_apps.common.models import ContentView
from core_apps.common.renderers import GenericJSONRenderer
from core_apps.issues.filters import IssueFilter
from core_apps.issues.permissions import (
    IsAssignedUserOrTenantOrOwner,
    IsReportedByUserOrAssignedUserOrIsTenant,
    IsReportedByUserOrStaff,
    IsStaffOrSuperUser,
)

from .emails import send_issue_confirmation_email, send_issue_resolved_email
from .models import Issue
from .serializers import IssueSerializer, IssueStatusUpdateSerializer

logger = logging.getLogger(__name__)


class IssueListAPIView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [IsStaffOrSuperUser]
    object_label = "issues"


class AssignedIssuesListView(generics.ListAPIView):
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "assigned_issues"

    def get_queryset(self):  # type: ignore
        return Issue.objects.filter(assigned_to=self.request.user)


class MyIssuesListAPIView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    object_label = "my_issues"
    renderer_classes = [GenericJSONRenderer]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]

    def get_queryset(self):  # type: ignore
        return Issue.objects.filter(reported_by=self.request.user)


class UserRelatedIssuesListAPIView(generics.ListAPIView):
    serializer_class = IssueSerializer
    object_label = "my_issues"
    renderer_classes = [GenericJSONRenderer]
    filter_backends = [DjangoFilterBackend]
    # filterset_fields = ["status"]
    filterset_class = IssueFilter

    def get_queryset(self):  # type: ignore
        user = self.request.user
        user_apartments = Apartment.objects.filter(
            owner=user
        ) | Apartment.objects.filter(tenants=user)

        filters = Q(reported_by=user) | Q(assigned_to=user)
        if user_apartments.exists():
            filters |= Q(apartment__in=user_apartments)

        return Issue.objects.filter(filters).distinct()


class IssueCreateAPIView(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "issue"

    def perform_create(self, serializer: IssueSerializer) -> None:
        apartment_id = self.request.data.get("apartmentId")  # type: ignore

        if not apartment_id:
            raise ValidationError({"apartmentId": ["Apartment ID is required."]})

        try:
            apartment = Apartment.objects.filter(
                Q(id=apartment_id)
                & (Q(owner=self.request.user) | Q(tenants=self.request.user))
            ).first()

            if not apartment:
                raise PermissionDenied(
                    "You do not have permission to report an issue for this apartment."
                )

        except Apartment.DoesNotExist:
            raise PermissionDenied(
                "You do not have permission to report an issue for this apartment."
            )

        issue = serializer.save(reported_by=self.request.user, apartment=apartment)
        # logger.info(f"Issue {issue.title} created. Sending confirmation email...")

        send_issue_confirmation_email(issue)


class IssueDetailAPIView(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [IsReportedByUserOrAssignedUserOrIsTenant]
    object_label = "issue"

    def retrieve(self, request, *args, **kwargs):
        issue = self.get_object()
        self.record_issue_view(issue)
        return super().retrieve(request, *args, **kwargs)

    def record_issue_view(self, issue):
        content_type = ContentType.objects.get_for_model(issue)
        viewer_ip = self.get_client_ip()
        user = self.request.user

        obj, created = ContentView.objects.update_or_create(
            content_type=content_type,
            object_id=issue.pk,
            user=user,
            viewer_ip=viewer_ip,
            defaults={"last_viewed": timezone.now()},
        )

    def get_client_ip(self) -> str:
        x_forwared_for = self.request.META.get("HTTP_X_FORWARED_FOR")
        if x_forwared_for:
            ip = x_forwared_for.split(",")[0]
        else:
            ip = self.request.META.get("REMOTE_ADDR")
        return ip or "0.0.0.0"


class IssueUpdateAPIView(generics.UpdateAPIView):
    queryset = Issue.objects.all()
    lookup_field = "id"
    serializer_class = IssueStatusUpdateSerializer
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [IsAssignedUserOrTenantOrOwner]
    object_label = "issue"

    def perform_update(self, serializer):
        instance = serializer.save()
        send_issue_resolved_email(instance)


class IssueDeleteAPIView(generics.DestroyAPIView):
    queryset = Issue.objects.all()
    lookup_field = "id"
    serializer_class = IssueSerializer
    permission_classes = [IsReportedByUserOrStaff]
