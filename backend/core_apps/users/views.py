import logging

from django.conf import settings
from djoser.social.views import ProviderAuthView
from rest_framework import generics, status

# from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core_apps.apartments.models import Apartment
from core_apps.users.emails import send_welcome_email
from core_apps.users.serializers import EmailUserCreateSerializer
from core_apps.users.utils import generate_random_password

logger = logging.getLogger(__name__)


class RegisterUserByEmail(generics.CreateAPIView):
    serializer_class = EmailUserCreateSerializer

    def perform_create(self, serializer):  # type: ignore
        password = generate_random_password()

        email = self.request.data.get("email")  # type: ignore
        apartment_id = self.request.data.get("apartmentId")  # type: ignore

        user = serializer.save(
            email=email,
            password=password,
            username=email,
            is_active=True,
        )

        send_welcome_email(user)

        apartment = Apartment.objects.get(id=apartment_id)
        apartment.tenants.add(user)

        return Response(
            {
                "message": "User created successfully. Check your email for login details."
            },
            status=status.HTTP_201_CREATED,
        )


def set_auth_cookies(
    response: Response, access_token: str, refresh_token: str | None = None
) -> None:
    acces_token_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
    cookie_settings = {
        "path": settings.COOKIE_PATH,
        "secure": settings.COOKIE_SECURE,
        "httponly": settings.COOKIE_HTTPONLY,
        "samesite": settings.COOKIE_SAMESITE,
        "max_age": acces_token_lifetime,
    }
    response.set_cookie("access", access_token, **cookie_settings)

    if refresh_token:
        refresh_token_lifetime = settings.SIMPLE_JWT[
            "REFRESH_TOKEN_LIFETIME"
        ].total_seconds()
        refresh_cookie_settings = cookie_settings.copy()
        refresh_cookie_settings["max_age"] = refresh_token_lifetime
        response.set_cookie("refresh", refresh_token, **refresh_cookie_settings)

        logged_in_cookie_settings = cookie_settings.copy()
        logged_in_cookie_settings["httponly"] = False
        response.set_cookie("logged_in", "true", **logged_in_cookie_settings)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        token_res = super().post(request, *args, **kwargs)

        if token_res.status_code == status.HTTP_200_OK and token_res.data:
            access_token = token_res.data.get("access")
            refresh_token = token_res.data.get("refresh")

            if access_token and refresh_token:
                set_auth_cookies(
                    token_res, access_token=access_token, refresh_token=refresh_token
                )

                token_res.data.pop("access", None)
                token_res.data.pop("refresh", None)

                token_res.data["message"] = "Login successfully"
            else:
                token_res.data["message"] = "Login failed"
                logger.error("Access or refresh token not found in login response data")
        else:
            logger.error(f"Token response error: {token_res.status_code}")
            token_res.data = {"message": "Authentication failed"}

        return token_res


logger = logging.getLogger(__name__)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            response = Response(
                {"message": "Refresh token not found in cookies"},
                status=status.HTTP_400_BAD_REQUEST,
            )
            response.set_cookie(
                "logged_in",
                "false",
                path=settings.COOKIE_PATH,
                secure=settings.COOKIE_SECURE,
                httponly=False,
                samesite=settings.COOKIE_SAMESITE,
            )
            return response

            # raise AuthenticationFailed("Refresh token missing or invalid")

        try:
            refresh_token_obj = RefreshToken(refresh_token)
            access_token = refresh_token_obj.access_token
            new_refresh_token = str(refresh_token_obj)

            refresh_res = Response(
                {
                    "access": str(access_token),
                    "refresh": new_refresh_token,
                },
                status=status.HTTP_200_OK,
            )

            set_auth_cookies(
                refresh_res,
                access_token=str(access_token),
                refresh_token=new_refresh_token,
            )

            refresh_res.data["message"] = "Access tokens refreshed successfully"  # type: ignore
            return refresh_res

        except InvalidToken as e:
            logger.error(f"Invalid token: {str(e)}")
            return Response(
                {"message": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(f"Error refreshing token: {str(e)}")
            return Response(
                {"message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# class CustomTokenRefreshView(TokenRefreshView):
#     def post(self, request: Request, *args, **kwargs) -> Response:
#         refresh_token = request.COOKIES.get("refresh")

#         data = request.data if request.data else {}

#         if refresh_token:
#             data["refresh"] = refresh_token  # type: ignore

#         request._full_data = data

#         try:
#             refresh_res = super().post(request, *args, **kwargs)

#             if refresh_res.status_code == status.HTTP_200_OK:
#                 if refresh_res.data:
#                     access_token = refresh_res.data.get("access")
#                     refresh_token = refresh_res.data.get("refresh")

#                     if access_token and refresh_token:
#                         set_auth_cookies(
#                             refresh_res,
#                             access_token=access_token,
#                             refresh_token=refresh_token,
#                         )
#                         refresh_res.data.pop("access", None)
#                         refresh_res.data.pop("refresh", None)

#                         refresh_res.data["message"] = (
#                             "Access tokens refreshed successfully"
#                         )
#                     else:
#                         refresh_res.data["message"] = (
#                             "Access or refresh tokens not found in refresh response data"
#                         )
#                         logger.error(
#                             "Access or refresh token not found in refresh response data"
#                         )
#                 else:
#                     refresh_res.data = {
#                         "message": "No data returned from refresh token response"
#                     }
#                     logger.error("No data returned in refresh response")

#             return refresh_res

#         except InvalidToken as e:
#             logger.error(f"Invalid token: {str(e)}")
#             return Response(
#                 {"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
#             )
#         except Exception as e:
#             logger.error(f"Error refreshing token: {str(e)}")
#             return Response(
#                 {"message": "Internal server error"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        provider_res = super().post(request, *args, **kwargs)

        if provider_res.status_code == status.HTTP_201_CREATED and provider_res.data:
            access_token = provider_res.data.get("access")
            refresh_token = provider_res.data.get("refresh")

            if access_token and refresh_token:
                set_auth_cookies(
                    provider_res,
                    access_token=access_token,
                    refresh_token=refresh_token,
                )

                provider_res.data.pop("access", None)
                provider_res.data.pop("refresh", None)

                provider_res.data["message"] = "You are logged in Successfully."
            else:
                provider_res.data["message"] = (
                    "Access or refresh token not found in provider response"
                )
                logger.error(
                    "Access or refresh token not found in provider response data"
                )
        else:
            provider_res.data = {"message": "Authentication failed or no data returned"}
            logger.error("Authentication failed or no data in provider response")

        return provider_res


class LogoutAPIView(APIView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        response.delete_cookie("logged_in")
        return response
