from django.urls import re_path

from .consumers import ApartmentChatConsumer, PrivateChatConsumer

websocket_urlpatterns = [
    re_path(
        r"ws/chat/private/(?P<receiver_id>[\w-]+)/$", PrivateChatConsumer.as_asgi()
    ),
    re_path(
        r"ws/chat/apartment/(?P<apartment_id>[\w-]+)/$", ApartmentChatConsumer.as_asgi()
    ),
]
