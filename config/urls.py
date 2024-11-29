from django.contrib import admin
from django.conf import settings
from django.urls import path

urlpatterns = [
    # path('admin/', admin.site.urls),
    path(settings.ADMIN_URL, admin.site.urls)
]
