import logging
from typing import Literal

from django.contrib.contenttypes.models import ContentType
from django.http import Http404
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError

from core_apps.apartments.models import Apartment
from core_apps.common.models import ContentView
from core_apps.common.renderers import GenericJSONRenderer

from .emails import send_issue_confirmation_email, send_issue_resolved_email
from .models import Issue
from .serializers import IssueSerializer, IssueStatusUpdateSerializer

logger = logging.getLogger(__name__)


class IsStaffOrSuperUser(permissions.BasePermission):
    """Permission class for staff or superuser access."""

    message = "Access to this information is restricted to staff and admin users only."

    def has_permission(self, request, view) -> Literal[True]:
        user = request.user

        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return True

        logger.warning(
            f"Unauthorized access attempt by user {user.get_user_full_name} (username: {user.username}) "
            f"to {view.__class__.__name__} view. Required: staff or superuser permissions."
        )

        raise PermissionDenied(self.message)


class IsReportedByUserOrAssignedUserOrStaff(permissions.BasePermission):
    """Permission class for users who reported, are assigned, or are staff."""

    message = "You do not have permission to view or modify this issue."

    def has_permission(self, request, view) -> Literal[True]:
        user = request.user

        try:
            issue = view.get_object()
        except Http404:
            raise PermissionDenied(self.message)

        if not (
            user.is_authenticated
            and (
                user.is_staff or user == issue.reported_by or user == issue.assigned_to
            )
        ):
            logger.warning(
                f"Unauthorized access attempt by user {user.get_user_full_name()} to issue {issue.title} "
                f"(Issue ID: {issue.id})"
            )
            raise PermissionDenied(self.message)

        return True


class IsAssignedUserOrStaff(permissions.BasePermission):
    """Permission class for users assigned to an issue or staff users."""

    message = "You do not have permission to modify this issue."

    def has_permission(self, request, view) -> Literal[True]:
        user = request.user
        try:
            issue = view.get_object()
        except Http404:
            raise PermissionDenied(self.message)

        if not (user.is_authenticated and (user.is_staff or user == issue.assigned_to)):
            logger.warning(
                f"Unauthorized access attempt by user {user.get_full_name()} "
                f"to issue {issue.title} (Issue ID: {issue.id})"
            )
            raise PermissionDenied(self.message)

        return True


class IsReportedByUserOrStaff(permissions.BasePermission):
    """Permission class for users who reported the issue or staff."""

    message = "You do not have permission to view or modify this issue."

    def has_permission(self, request, view) -> Literal[True]:
        user = request.user
        try:
            issue = view.get_object()
        except Http404:
            logger.warning(
                f"Attempted to access non-existing issue by {user.get_full_name}"
            )
            raise PermissionDenied(self.message)

        if not (user.is_authenticated and (user.is_staff or user == issue.reported_by)):
            logger.warning(
                f"Unauthorized access attempt by user {user.get_full_name()} "
                f"to issue {issue.title} (Issue ID: {issue.id})"
            )
            raise PermissionDenied(self.message)

        return True


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

    def get_queryset(self):
        return Issue.objects.filter(assigned_to=self.request.user)


class MyIssuesListAPIView(generics.ListAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "my_issues"

    def get_queryset(self):
        return Issue.objects.filter(reported_by=self.request.user)


class IssueCreateAPIView(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "issue"

    def perform_create(self, serializer: IssueSerializer) -> None:
        apartment_id = self.request.data.get("apartmentId")

        if not apartment_id:
            raise ValidationError({"apartmentId": ["Apartment ID is required."]})

        try:
            apartment = Apartment.objects.get(id=apartment_id, tenant=self.request.user)
        except Apartment.DoesNotExist:
            raise PermissionDenied(
                "You do not have permission to report an issue for this apartment."
            )

        issue = serializer.save(reported_by=self.request.user, apartment=apartment)
        logger.info(f"Issue {issue.title} created. Sending confirmation email...")

        send_issue_confirmation_email(issue)


class IssueDetailAPIView(generics.RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    lookup_field = "id"
    renderer_classes = [GenericJSONRenderer]
    permission_classes = [IsReportedByUserOrAssignedUserOrStaff]
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
    permission_classes = [IsAssignedUserOrStaff]
    object_label = "issue"

    def perform_update(self, serializer):
        instance = serializer.save()
        send_issue_resolved_email(instance)


class IssueDeleteAPIView(generics.DestroyAPIView):
    queryset = Issue.objects.all()
    lookup_field = "id"
    serializer_class = IssueSerializer
    permission_classes = [IsReportedByUserOrStaff]
