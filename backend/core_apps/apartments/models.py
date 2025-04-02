from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Apartment(TimeStampedModel):
    street = models.CharField(max_length=255, verbose_name=_("Street"))
    building_number = models.CharField(
        max_length=50,
        verbose_name=_("Building Number"),
        blank=True,
        null=True,
    )
    apartment_number = models.CharField(
        max_length=10,
        verbose_name=_("Apartment Number"),
        blank=True,
        null=True,
    )
    city = models.CharField(max_length=100, verbose_name=_("City"))
    postal_code = models.CharField(
        max_length=20,
        verbose_name=_("Postal Code"),
        blank=True,
        null=True,
    )
    country = models.CharField(max_length=100, verbose_name=_("Country"))

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_apartments",
        verbose_name=_("Owner"),
    )

    tenants = models.ManyToManyField(
        User,
        related_name="rented_apartments",
        blank=True,
        verbose_name=_("Tenants"),
    )

    # tenants = models.ManyToManyField(
    #     User,
    #     through="ApartmentTenant",
    #     related_name="rented_apartments",
    #     blank=True,
    #     verbose_name=_("Tenants"),
    # )

    class Meta(TimeStampedModel.Meta):
        verbose_name = _("Apartment")
        verbose_name_plural = _("Apartments")
        ordering = ["street", "building_number", "apartment_number"]

    def _build_address(self) -> str:
        address = f"{self.street}"
        if self.building_number:
            address += f" {self.building_number}"
        if self.apartment_number:
            address += f" (Apartment {self.apartment_number})"
        if self.postal_code:
            address += f", {self.postal_code}"
        address += f" {self.city}, {self.country}"
        return address

    def __str__(self) -> str:
        return self._build_address()

    def full_address(self) -> str:
        return self._build_address()

    def is_owner(self, user):
        return self.owner == user


class ApartmentTenant(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class RentalContract(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", _("Active")
        EXPIRED = "expired", _("Expired")
        TERMINATED = "terminated", _("Terminated")

    apartment = models.ForeignKey(
        Apartment,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="rental_contracts",
        verbose_name=_("Apartment"),
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owner_contracts",
        verbose_name=_("Owner"),
    )
    tenant = models.CharField(
        max_length=150,
        verbose_name=_("Tenant"),
    )
    start_date = models.DateField(verbose_name=_("Start Date"))
    end_date = models.DateField(verbose_name=_("End Date"))
    rent_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Rent Amount"),
        blank=True,
        null=True,
    )
    deposit = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Deposit"),
        blank=True,
        null=True,
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
        verbose_name=_("Contract Status"),
    )

    def __str__(self):
        return f"Rental contract for {self.apartment} between {self.owner} and {self.tenant}"

    class Meta(TimeStampedModel.Meta):
        verbose_name = _("Rental Contract")
        verbose_name_plural = _("Rental Contracts")
        ordering = ["start_date"]
