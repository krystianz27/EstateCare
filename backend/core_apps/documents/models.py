from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.apartments.models import Apartment
from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Document(TimeStampedModel):
    title = models.CharField(max_length=255, verbose_name=_("Title"))
    file = models.FileField(upload_to="documents/", verbose_name=_("File"))
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents_uploaded",
        verbose_name=_("Uploaded By"),
    )
    apartment = models.ForeignKey(
        Apartment,
        on_delete=models.CASCADE,
        related_name="documents",
        verbose_name=_("Apartment"),
        null=True,
        blank=True,
    )
    shared_with = models.ManyToManyField(
        User,
        related_name="documents_shared",
        blank=True,
        verbose_name=_("Shared With"),
    )

    class Meta(TimeStampedModel.Meta):
        verbose_name = _("Document")
        verbose_name_plural = _("Documents")

    def __str__(self) -> str:
        return self.title

    def has_access(self, user: User) -> bool:  # type: ignore
        return user == self.uploaded_by or user in self.shared_with.all()

    def get_apartment_or_none(self) -> Apartment | None:
        return self.apartment if self.apartment else None
