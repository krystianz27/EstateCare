from autoslug import AutoSlugField
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Report(TimeStampedModel):
    title = models.CharField(max_length=255, verbose_name=_("Title"))
    slug = AutoSlugField(populate_from="title", unique=True)
    reported_by = models.ForeignKey(
        User,
        related_name="reports_made",
        on_delete=models.CASCADE,
        verbose_name=_("Reported by"),
    )
    reported_user = models.ForeignKey(
        User,
        related_name="reports_received",
        on_delete=models.CASCADE,
        verbose_name=_("Reported user"),
    )

    description = models.TextField(verbose_name=_("Description"))

    def __str__(self) -> str:
        return f"Report by {self.reported_by.get_full_name} against {self.reported_user.get_full_name}"

    class Meta(TimeStampedModel.Meta):
        verbose_name = _("Report")
        verbose_name_plural = _("Reports")
        ordering = ["-created_at"]
