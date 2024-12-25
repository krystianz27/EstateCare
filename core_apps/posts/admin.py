from django.contrib import admin
from django.db.models import Count, QuerySet

from core_apps.common.admin import ContentViewInLine

from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "tag_list", "get_total_views"]
    inlines = [ContentViewInLine]

    def get_queryset(self, request) -> QuerySet[Post]:
        return (
            super()
            .get_queryset(request)
            .prefetch_related("tags")
            .annotate(total_views=Count("content_views"))
        )

    def get_total_views(self, obj: Post) -> int:
        return obj.total_views

    get_total_views.short_description = "Total Views"

    def tag_list(self, obj: Post) -> str:
        tags = obj.tags.all()
        return ", ".join(tag.name for tag in tags) if tags else "No Tags"

    tag_list.short_description = "Tags"
