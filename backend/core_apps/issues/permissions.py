import logging
from typing import Literal

from django.http import Http404
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

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


class IsReportedByUserOrAssignedUserOrIsTenant(permissions.BasePermission):
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
                user.is_staff
                or user == issue.reported_by
                or user == issue.assigned_to
                or user == issue.apartment.owner
                or issue.apartment.tenants.filter(id=user.id).exists()
            )
        ):
            logger.warning(
                f"Unauthorized access attempt by user {user.get_user_full_name()} to issue {issue.title} "
                f"(Issue ID: {issue.id})"
            )
            raise PermissionDenied(self.message)

        return True


class IsAssignedUserOrTenantOrOwner(permissions.BasePermission):
    """Permission class for users assigned to an issue or staff users."""

    message = "You do not have permission to modify this issue."

    def has_permission(self, request, view) -> Literal[True]:
        user = request.user
        try:
            issue = view.get_object()
        except Http404:
            raise PermissionDenied(self.message)

        if not (
            user.is_authenticated
            and (
                user.is_staff
                or user == issue.reported_by
                or user == issue.assigned_to
                or user == issue.apartment.owner
                or issue.apartment.tenants.filter(id=user.id).exists()
            )
        ):
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
