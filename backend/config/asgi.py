"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

import django

# import core_apps.chat.routing as chat
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

# application = get_asgi_application()
django_asgi_app = get_asgi_application()
django.setup()
import core_apps.chat.routing as chat
from core_apps.chat.middleware import WebSocketAuthMiddleware

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": WebSocketAuthMiddleware(URLRouter(chat.websocket_urlpatterns)),
    }
)
