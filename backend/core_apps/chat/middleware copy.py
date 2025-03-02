import logging
from typing import Optional, Tuple

import jwt
from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import Token

from core_apps.users.models import User

logger = logging.getLogger(__name__)


class TokenAuthenticator:
    async def authenticate(self, scope) -> Optional[Tuple[User, Token]]:
        headers = dict(scope.get("headers", []))
        print("Headers: ", headers)

        raw_token = None
        if b"cookie" in headers:
            cookies = dict(
                (x.strip(), y.strip())
                for x, y in [
                    cookie.split("=", 1)
                    for cookie in headers[b"cookie"].decode().split("; ")
                    if "=" in cookie
                ]
            )
            raw_token = cookies.get("access")
        print("RAW token: ", raw_token)

        if raw_token:
            try:
                user = await self.get_user_from_token(raw_token)
                if user:
                    return (
                        user,
                        None,
                    )  # type: ignore
                else:
                    logger.error("User could not be found based on the token.")
            except Exception as e:
                logger.error(f"Unexpected error during authentication: {str(e)}")
        else:
            logger.error("No token provided in request.")

        return None

    @sync_to_async
    def get_user_from_token(self, token: str) -> Optional[User]:
        try:
            payload = jwt.decode(
                token, settings.SIMPLE_JWT["SIGNING_KEY"], algorithms=["HS256"]
            )
            user = User.objects.get(id=payload["user_id"])
            logger.debug(f"User found: {user}")
            return user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            logger.error("User not found or token invalid")
            return None


class WebSocketAuthMiddleware(BaseMiddleware):
    def __init__(self, inner, *args, **kwargs):
        super().__init__(inner, *args, **kwargs)
        self.authenticator = TokenAuthenticator()

    async def __call__(self, scope, receive, send):
        auth_result = await self.authenticator.authenticate(scope)
        user, _ = auth_result if auth_result else (AnonymousUser(), None)
        print("User", user)
        scope["user"] = user

        return await super().__call__(scope, receive, send)
