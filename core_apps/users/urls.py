from django.urls import path, re_path

from .views import (
    CustomProviderAuthView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutAPIView,
)

urlpatterns = [
    re_path(
        r"^o/(?P<Provider>\S+)/$",
        CustomProviderAuthView.as_view(),
        name="provider_auth",
    ),
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", CustomTokenRefreshView.as_view()),
    path("logout/", LogoutAPIView.as_view()),
]
