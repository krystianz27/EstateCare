from typing import Literal

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import SAFE_METHODS, BasePermission


class CanCreateAndListDocuments(BasePermission):
    """
    Pozwala na tworzenie i listowanie dokumentów tylko użytkownikom zalogowanym.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return (
                obj.uploaded_by == request.user
                or obj.shared_with.filter(id=request.user.id).exists()
            )
        return request.user.is_authenticated


class IsDocumentOwnerOrSharedWith(BasePermission):
    """
    Grants access to the document owner or users with whom the document has been shared.
    Only the owner can modify or delete the document.
    """

    def has_object_permission(self, request, view, obj) -> Literal[True]:
        # If the request method is a safe method (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            if not (
                obj.uploaded_by == request.user
                or obj.shared_with.filter(id=request.user.id).exists()
            ):
                raise PermissionDenied(
                    "You do not have permission to access this document."
                )
        else:
            # If the request method is modifying the document (PUT, PATCH, DELETE)
            if obj.uploaded_by != request.user:
                raise PermissionDenied(
                    "You do not have permission to modify this document."
                )  # PUT, PATCH, DELETE only for document owner
        return True


class IsDocumentOwner(BasePermission):
    """
    Allows editing and deleting documents only for the owners.
    """

    def has_object_permission(self, request, view, obj):
        return obj.uploaded_by == request.user


class CanViewSharedDocuments(BasePermission):
    """
    Pozwala na wyświetlanie dokumentów tylko właścicielowi i użytkownikom, którym zostały one udostępnione.
    """

    def has_object_permission(self, request, view, obj):
        return (
            obj.uploaded_by == request.user
            or obj.shared_with.filter(id=request.user.id).exists()
        )
