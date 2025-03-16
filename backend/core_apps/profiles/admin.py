from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "gender", "slug")
    # list_display = ("id", "user", "gender", "occupations", "slug")
    list_display_links = ["id", "user"]
    list_filter = ["occupations"]
    filter_horizontal = ["occupations"]
