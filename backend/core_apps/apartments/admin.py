from django.contrib import admin

from .models import Apartment


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "building_number",
        "apartment_number",
        "street",
        "city",
        "postal_code",
        "country",
        "owner",
        "get_tenants",
    ]
    list_display_links = [
        "id",
    ]
    list_filter = ["building_number", "city", "country", "owner"]
    search_fields = [
        "unit_number",
        "tenant__username",
        "tenant__email",
        "owner__username",
    ]
    ordering = [
        "building_number",
        "apartment_number",
    ]

    filter_horizontal = ("tenants",)

    def get_tenants(self, obj):
        return ", ".join([tenant.username for tenant in obj.tenants.all()])

    get_tenants.short_description = "Tenants"  # type: ignore

    def get_owner_full_name(self, obj):
        return obj.owner.get_full_name() if obj.owner else "No Owner"

    get_owner_full_name.short_description = "Owner"  # type: ignore

    def get_tenant_full_name(self, obj):
        tenants = ", ".join([tenant.get_full_name() for tenant in obj.tenants.all()])
        return tenants if tenants else "No Tenant"

    get_tenant_full_name.short_description = "Tenant(s)"  # type: ignore
