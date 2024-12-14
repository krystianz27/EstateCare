from django.contrib import admin

from .models import Apartment


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ["id", "unit_number", "building", "floor", "get_tenant_full_name"]
    list_display_links = ["id", "unit_number"]
    list_filter = ["building", "floor"]
    search_fields = ["unit_number", "tenant__username", "tenant__email"]
    ordering = ["building", "floor"]
    autocomplete_fields = ["tenant"]

    def get_tenant_full_name(self, obj):
        return obj.tenant.get_user_full_name if obj.tenant else "No Tenant"

    get_tenant_full_name.short_description = "Tenant"  # type: ignore
