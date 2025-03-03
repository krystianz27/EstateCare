import logging
from typing import Optional, Tuple

from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import Token

from core_apps.users.models import User

logger = logging.getLogger(__name__)


class TokenAuthenticator(JWTAuthentication):
    async def authenticate_scope(self, scope) -> Optional[Tuple[User, Token]]:
        """Asynchronous version of authenticate for WebSockets"""
        headers = dict(scope.get("headers", []))

        raw_token = None

        if b"cookie" in headers:
            cookies = {
                k.strip(): v.strip()
                for k, v in (
                    cookie.split("=", 1)
                    for cookie in headers[b"cookie"].decode().split("; ")
                    if "=" in cookie
                )
            }
            raw_token = cookies.get(settings.COOKIE_NAME)

        if raw_token:
            try:
                validated_token = await self.get_validated_token_async(raw_token)
                user = await self.get_user_async(validated_token)
                if user is not None:
                    return user, validated_token
            except TokenError as e:
                # logger.error(f"Token validation error: {str(e)}")
                return None
        return None

    @sync_to_async
    def get_validated_token_async(self, raw_token: str) -> Token:
        return self.get_validated_token(raw_token.encode())

    @sync_to_async
    def get_user_async(self, validated_token: Token) -> Optional[User]:
        return self.get_user(validated_token)


class WebSocketAuthMiddleware(BaseMiddleware):
    def __init__(self, inner, *args, **kwargs):
        super().__init__(inner, *args, **kwargs)
        self.authenticator = TokenAuthenticator()

    async def __call__(self, scope, receive, send):
        auth_result = await self.authenticator.authenticate_scope(scope)
        user, _ = auth_result if auth_result else (AnonymousUser(), None)
        scope["user"] = user

        return await super().__call__(scope, receive, send)
