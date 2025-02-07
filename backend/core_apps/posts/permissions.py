from typing import Literal

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import View

from core_apps.profiles.models import Profile

User = get_user_model()


class CanCreateEditPost(BasePermission):
    message = "You do not have permission to create or edit this post."

    def has_permission(self, request: Request, view: View) -> Literal[True]:
        user = request.user
        if not user or not user.is_authenticated:
            raise PermissionDenied(
                "Authentication is required to access this resource."
            )

        if user.is_superuser or user.is_staff:
            return True

        profile = getattr(user, "profile", None)
        if profile and profile.occupation == Profile.Occupation.TENANT:
            return True

        raise PermissionDenied(self.message)


# class CanCreateEditPost(BasePermission):
#     message = "You do not have permission to create or edit this post."

#     def has_permission(self, request: Request, view: View) -> bool:
#         user = request.user
#         if not user or not user.is_authenticated:
#             self.message = "Authentication is required to access this resource."
#             return False

#         if user.is_superuser or user.is_staff:
#             return True

#         profile = getattr(user, "profile", None)
#         if profile and profile.occupation == Profile.Occupation.TENANT:
#             return True

#         return False
