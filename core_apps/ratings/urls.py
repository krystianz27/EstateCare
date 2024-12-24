from django.urls import path

from .views import RatingCreateAPIView, RatingUpdateAPIView

urlpatterns = [
    path("create/", RatingCreateAPIView.as_view(), name="rating-create"),
    path("update/<uuid:id>/", RatingUpdateAPIView.as_view(), name="rating-update"),
]
