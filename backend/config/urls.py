from django.conf import settings
from django.conf.urls.static import static
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


urlpatterns = [
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/v1/auth/", include("djoser.urls")),
    path("api/v1/auth/", include("core_apps.users.urls")),
    path("api/v1/profiles/", include("core_apps.profiles.urls")),
    path("api/v1/apartments/", include("core_apps.apartments.urls")),
    path("api/v1/documents/", include("core_apps.documents.urls")),
    path("api/v1/issues/", include("core_apps.issues.urls")),
    path("api/v1/reports/", include("core_apps.reports.urls")),
    path("api/v1/ratings/", include("core_apps.ratings.urls")),
    path("api/v1/posts/", include("core_apps.posts.urls")),
    path("api/v1/chat/", include("core_apps.chat.urls")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Estate Care Apartment"
admin.site.site_title = "Estate Care Admin Site"
admin.site.index_title = "Welcome to Estate Care Admin Site"
