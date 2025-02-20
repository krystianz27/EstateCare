from django.urls import path

from .views import (
    AddDeleteTenantView,
    ApartmentListCreateView,
    ApartmentRetrieveUpdateDestroyView,
)

urlpatterns = [
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
