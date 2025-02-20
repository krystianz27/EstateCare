from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsApartmentOwnerOrTenant(BasePermission):
    """
    Grants access to the apartment for the owner or tenants.
    The owner can modify or delete the apartment.
    The tenant can only view the apartment.
    """

    def has_object_permission(self, request, view, obj):
        # Check if the method is safe (GET, HEAD, OPTIONS)
        if request.method in SAFE_METHODS:
            if (
                obj.owner == request.user
                or obj.tenants.filter(id=request.user.id).exists()
            ):
                return True
            else:
                raise PermissionDenied(
                    "You do not have permission to access this apartment."
                )

        # If the method is PUT, PATCH, DELETE (modifying the apartment)
        if request.method in ["PUT", "PATCH", "DELETE"]:
            if obj.owner != request.user:
                raise PermissionDenied(
                    "You do not have permission to modify or delete this apartment."
                )

        return True


class IsApartmentOwner(BasePermission):
    """
    Allows modification and deletion of apartments only for the owners.
    """

    def has_object_permission(self, request, view, obj):
        if obj.owner != request.user:
            raise PermissionDenied(
                "You do not have permission to modify or delete this apartment."
            )
        return True
