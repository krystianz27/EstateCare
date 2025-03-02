from django.urls import path

from .views import MessageApartmentListView, PrivateMessageListView

urlpatterns = [
    path(
        "apartment/<uuid:apartment_uuid>/",
        MessageApartmentListView.as_view(),
        name="message-apartment-list",
    ),
    path(
        "private/<uuid:receiver_uuid>/",
        PrivateMessageListView.as_view(),
        name="message-private-list",
    ),
]
