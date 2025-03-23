from django.urls import path, re_path

from .views import (
    CustomProviderAuthView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutAPIView,
    RegisterUserByEmail,
)

urlpatterns = [
    re_path(
        r"^o/(?P<provider>\S+)/$",
        CustomProviderAuthView.as_view(),
        name="provider_auth",
    ),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", CustomTokenRefreshView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
    path("register-by-email/", RegisterUserByEmail.as_view()),
]
