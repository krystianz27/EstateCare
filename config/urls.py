from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Estate Management API",
        default_version="v1",
        description="An apartment managements API for Real Estate",
        contact=openapi.Contact(email="krystiaann27@gmail.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

from django.http import JsonResponse


def debug_headers(request):
    meta_filtered = {
        key: value
        for key, value in request.META.items()
        if isinstance(value, (str, int, float, bool, type(None)))
    }
    return JsonResponse({"headers": dict(request.headers), "meta": meta_filtered})


urlpatterns = [
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/v1/auth/", include("djoser.urls")),
    path("api/v1/auth/", include("core_apps.users.urls")),
    path("api/v1/auth/debug/", debug_headers),
]

admin.site.site_header = "Estate Care Apartment"
admin.site.site_title = "Estate Care Admin Site"
admin.site.index_title = "Welcome to Estate Care Admin Site"
