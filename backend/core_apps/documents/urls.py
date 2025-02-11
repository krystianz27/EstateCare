from django.urls import path

from . import views

urlpatterns = [
    path(
        "",
        views.DocumentListCreateAPIView.as_view(),
        name="document-list-create",
    ),
    path(
        "<uuid:id>/",
        views.DocumentRetrieveUpdateDestroyAPIView.as_view(),
        name="document-retrieve-update-destroy",
    ),
    path(
        "<uuid:id>/share/",
        views.DocumentShareAPIView.as_view(),
        name="document-share",
    ),
    path(
        "<uuid:id>/revoke/",
        views.DocumentRevokeShareAPIView.as_view(),
        name="document-revoke-share",
    ),
]
