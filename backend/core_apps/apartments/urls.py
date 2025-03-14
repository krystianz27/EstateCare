from django.urls import path

from .views import (  # UpdateRentalContractStatusView,
    AddDeleteTenantView,
    ApartmentListCreateView,
    ApartmentRetrieveUpdateDestroyView,
    RentalContractListCreateView,
    RentalContractRetrieveUpdateDestroyView,
)

urlpatterns = [
    path(
        "rental-contracts/",
        RentalContractListCreateView.as_view(),
        name="rental-contract-list-create",
    ),
    path(
        "rental-contracts/<uuid:id>/",
        RentalContractRetrieveUpdateDestroyView.as_view(),
        name="rental-contract-retrieve-update-destroy",
    ),
    # path(
    #     "rental-contracts/<uuid:id>/status/",
    #     UpdateRentalContractStatusView.as_view(),
    #     name="rental-contract-update-status",
    # ),
    path("", ApartmentListCreateView.as_view(), name="apartment-list-create"),
    path(
        "<uuid:id>/",
        ApartmentRetrieveUpdateDestroyView.as_view(),
        name="apartment-retrieve-update-destroy",
    ),
    path(
        "<uuid:id>/tenants/", AddDeleteTenantView.as_view(), name="add-delete-tenants"
    ),
]
