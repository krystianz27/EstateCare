import logging

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core_apps.common.renderers import GenericJSONRenderer

from .models import Apartment, RentalContract
from .permissions import IsApartmentOwner, IsApartmentOwnerOrTenant
from .serializers import (
    AddDeleteTenantSerializer,
    ApartmentSerializer,
    RentalContractSerializer,
)

logger = logging.getLogger(__name__)
User = get_user_model()


class ApartmentListCreateViewUnoptimized(generics.ListCreateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def get_queryset(self):  # type: ignore
        user = self.request.user
        role_filter = self.request.query_params.get("type", "all")  # type: ignore

        if role_filter == "owner":
            return Apartment.objects.filter(owner=user)

        elif role_filter == "tenant":
            return Apartment.objects.filter(tenants=user)

        else:
            return Apartment.objects.filter(
                Q(owner=user)
                | Q(pkid__in=Apartment.objects.filter(tenants=user).values("pkid"))
            )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ApartmentListCreateView(generics.ListCreateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "apartment"

    def get_queryset(self):  # type: ignore
        user = self.request.user
        role_filter = self.request.query_params.get("type", "all")  # type: ignore

        base_qs = Apartment.objects.select_related("owner").prefetch_related(
            "tenants", "issues"
        )

        if role_filter == "owner":
            return base_qs.filter(owner=user)

        elif role_filter == "tenant":
            return base_qs.filter(tenants=user)

        else:
            return base_qs.filter(
                Q(owner=user)
                | Q(pkid__in=Apartment.objects.filter(tenants=user).values("pkid"))
            )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ApartmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [IsAuthenticated, IsApartmentOwnerOrTenant]
    renderer_classes = [GenericJSONRenderer]
    lookup_field = "id"
    object_label = "apartment"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            self.permission_classes = [IsApartmentOwner]
        return super().get_permissions()

    def get(self, request, *args, **kwargs):
        """
        Retrieve a single Apartment instance.
        """

        return super().get(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        """
        Update a single Apartment instance.
        """
        return super().put(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        """
        Partially update a single Apartment instance.
        """
        return super().patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        """
        Delete a single Apartment instance.
        """
        return super().delete(request, *args, **kwargs)


class AddDeleteTenantView(generics.GenericAPIView):
    queryset = Apartment.objects.all()
    permission_classes = [IsAuthenticated, IsApartmentOwner]
    renderer_classes = [GenericJSONRenderer]
    serializer_class = AddDeleteTenantSerializer
    lookup_field = "id"
    object_label = "apartment"

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return self.perform_update(serializer)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def perform_update(self, serializer):
    #     apartment = self.get_object()

    #     tenants_to_add = User.objects.filter(
    #         id__in=serializer.validated_data.get("add", [])
    #     )
    #     tenants_to_remove = User.objects.filter(
    #         id__in=serializer.validated_data.get("remove", [])
    #     )

    #     if tenants_to_add.count() == 0 and tenants_to_remove.count() == 0:
    #         raise ValidationError(
    #             {"tenant_ids": ["No valid tenants found for the provided IDs."]}
    #         )

    #     if tenants_to_add.count() > 0:
    #         apartment.tenants.add(*tenants_to_add)

    #     if tenants_to_remove.count() > 0:
    #         apartment.tenants.remove(*tenants_to_remove)

    #     return Response(
    #         {"detail": "Tenants updated successfully"}, status=status.HTTP_200_OK
    #     )
    def perform_update(self, serializer):
        apartment = self.get_object()

        tenants_to_add = User.objects.filter(
            username__in=serializer.validated_data.get("add", [])
        )
        tenants_to_remove = User.objects.filter(
            username__in=serializer.validated_data.get("remove", [])
        )

        if tenants_to_add.count() == 0 and tenants_to_remove.count() == 0:
            raise ValidationError(
                {"tenant_ids": ["No valid tenants found for the provided IDs."]}
            )

        if tenants_to_add.count() > 0:
            apartment.tenants.add(*tenants_to_add)

        if tenants_to_remove.count() > 0:
            apartment.tenants.remove(*tenants_to_remove)

        return Response(
            {"detail": "Tenants updated successfully"}, status=status.HTTP_200_OK
        )


logger = logging.getLogger(__name__)


class RentalContractListCreateView(generics.ListCreateAPIView):
    queryset = RentalContract.objects.all()
    serializer_class = RentalContractSerializer
    permission_classes = [IsAuthenticated]
    renderer_classes = [GenericJSONRenderer]
    object_label = "rental_contract"
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ["status"]

    def get_queryset(self):  # type: ignore
        user = self.request.user
        status_filter = self.request.query_params.get("status")  # type: ignore
        apartment_id = self.request.query_params.get("apartment_id")  # type: ignore

        filters = Q(owner=user)

        if status_filter:
            filters &= Q(status=status_filter)

        if apartment_id:
            filters &= Q(apartment__id=apartment_id)

        return RentalContract.objects.filter(filters)

    def perform_create(self, serializer):
        apartment_id = self.request.data.get("apartment")  # type: ignore
        if apartment_id:
            try:
                apartment = Apartment.objects.get(id=apartment_id)
            except Apartment.DoesNotExist:
                raise NotFound(f"Apartment with id {apartment_id} not found.")
            serializer.save(owner=self.request.user, apartment=apartment)
        else:
            serializer.save(owner=self.request.user)


class RentalContractRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RentalContract.objects.all()
    serializer_class = RentalContractSerializer
    permission_classes = [IsAuthenticated, IsApartmentOwnerOrTenant]
    renderer_classes = [GenericJSONRenderer]
    lookup_field = "id"
    object_label = "rental_contract"

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
