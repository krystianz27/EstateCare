from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from core_apps.common.models import TimeStampedModel

User = get_user_model()


class Rating(TimeStampedModel):
    class RatingChoices(models.IntegerChoices):
        ONE = 1, _("Very Poor")
        TWO = 2, _("Poor")
        THREE = 3, _("Average")
        FOUR = 4, _("Good")
        FIVE = 5, _("Excellent")

    rated_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_ratings",
        verbose_name=_("Rated User"),
    )

    rating_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="given_ratings",
        verbose_name=_("Rating User"),
    )
    rating = models.IntegerField(
        choices=RatingChoices.choices, verbose_name=_("Rating")
    )
    comment = models.TextField(verbose_name=_("Comment"), blank=True)

    def __str__(self) -> str:
        return f"{self.rating_user.get_full_name()} rated {self.rated_user.get_full_name()} {self.rating}/5"

    def clean(self):
        if self.rated_user == self.rating_user:
            raise ValidationError(_("A user cannot rate themselves."))

        if (
            Rating.objects.filter(
                rating_user=self.rating_user, rated_user=self.rated_user
            )
            .exclude(pk=self.pk)
            .exists()
        ):
            raise ValidationError(_("You cannot rate the same user multiple times."))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    class Meta(TimeStampedModel.Meta):
        verbose_name = _("Rating")
        verbose_name_plural = _("Ratings")
        constraints = [
            models.UniqueConstraint(
                fields=["rated_user", "rating_user"], name="unique_user_rating"
            )
        ]
