from rest_framework import generics

from core_apps.common.renderers import GenericJSONRenderer
from core_apps.ratings.models import Rating

from .serializers import RatingSerializer


class RatingCreateAPIView(generics.CreateAPIView):
    serializer_class = RatingSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "rating"

    def perform_create(self, serializer):
        serializer.save(rating_user=self.request.user)


class RatingUpdateAPIView(generics.UpdateAPIView):
    queryset = Rating.objects.all()
    lookup_field = "id"
    serializer_class = RatingSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "rating"
