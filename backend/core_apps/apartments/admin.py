from django.contrib import admin

from .models import Apartment, RentalContract


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

    # raw_id_fields = ("tenants",)
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


#     def formfield_for_manytomany(self, db_field, request, **kwargs):
#         if db_field.name == "tenants":
#             kwargs["widget"] = admin.widgets.ManyToManyRawIdWidget(  # type: ignore
#                 db_field, self.admin_site
#             )
#         return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(RentalContract)
class RentalContractAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "get_apartment_address",
        "get_owner_full_name",
        "get_tenant_full_name",
        "start_date",
        "end_date",
        "status",
    ]
    list_display_links = [
        "id",
    ]
    list_filter = ["apartment", "owner", "status", "start_date", "end_date"]
    search_fields = [
        "tenant",
        "owner__username",
        "owner__email",
        "apartment__building_number",
        "apartment__apartment_number",
    ]
    ordering = [
        "start_date",
        "end_date",
    ]

    def get_owner_full_name(self, obj):
        return obj.owner.get_full_name() if obj.owner else "No Owner"

    get_owner_full_name.short_description = "Owner"  # type: ignore

    def get_tenant_full_name(self, obj):
        return obj.tenant if obj.tenant else "No Tenant"

    get_tenant_full_name.short_description = "Tenant"  # type: ignore

    def get_apartment_address(self, obj):
        return (
            f"{obj.apartment.building_number} {obj.apartment.apartment_number}, {obj.apartment.street}, {obj.apartment.city}, {obj.apartment.country}"
            if obj.apartment
            else "No Apartment"
        )

    get_apartment_address.short_description = "Apartment Address"  # type: ignore
