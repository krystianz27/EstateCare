from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from core_apps.apartments.models import Apartment

from .models import Message, MessageApartment
from .serializers import MessageApartmentSerializer, MessageSerializer

User = get_user_model()


class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class MessageApartmentListView(generics.ListAPIView):
    queryset = MessageApartment.objects.all()
    serializer_class = MessageApartmentSerializer
    pagination_class = MessagePagination

    def get_queryset(self):  # type: ignore
        apartment_uuid = self.kwargs.get("apartment_uuid")
        apartment = get_object_or_404(Apartment, id=apartment_uuid)
        return self.queryset.filter(chat__apartment_id=apartment).order_by(
            "-created_at"
        )


class PrivateMessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    pagination_class = MessagePagination

    def get_queryset(self):  # type: ignore
        user = self.request.user
        receiver_uuid = self.kwargs.get("receiver_uuid")

        receiver = get_object_or_404(User, id=receiver_uuid)

        return Message.objects.filter(
            sender__in=[user, receiver], receiver__in=[user, receiver]
        ).order_by("created_at")
