from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from django.http import Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from core_apps.apartments.models import Apartment
from core_apps.common.renderers import GenericJSONRenderer

from .models import Occupation, Profile
from .serializers import (
    AvatarUploadSerializer,
    ProfileSerializer,
    TenantSerializer,
    UpdateProfileSerializer,
)
from .tasks import upload_avatar_to_cloudinary

User = get_user_model()


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class ProfileListAPIView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    renderer_classes = [GenericJSONRenderer]
    pagination_class = StandardResultsSetPagination
    object_label = "profiles"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["user__username", "user__first_name", "user__last_name"]
    filterset_fields = ["occupations__name", "gender", "city_of_origin"]

    def get_queryset(  # type: ignore
        self,
    ) -> QuerySet[Profile]:
        return (
            Profile.objects.exclude(user__is_staff=True).exclude(
                user__is_superuser=True
            )
            # .filter(occupations__name=Profile.Occupation.TENANT)
        )


class ProfileDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "profile"

    def get_queryset(self) -> QuerySet[Profile]:  # type: ignore
        return Profile.objects.select_related("user").all()

    def get_object(self) -> Profile:  # type: ignore
        try:
            return Profile.objects.get(user=self.request.user)
        except Profile.DoesNotExist:
            raise Http404("Profile not found")


class ProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateProfileSerializer
    renderer_classes = [GenericJSONRenderer]
    object_label = "profile"

    def get_object(self) -> Profile:  # type: ignore
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer: UpdateProfileSerializer) -> Profile:  # type: ignore
        user_data = serializer.validated_data.pop("user", None)  # type: ignore
        profile = serializer.save()
        if user_data:
            User.objects.filter(id=self.request.user.id).update(**user_data)  # type: ignore
        return profile


class AvatarUploadView(APIView):
    def patch(self, request, *args, **kwargs):
        return self.upload_avatar(request, *args, **kwargs)

    def upload_avatar(self, request, *args, **kwargs):
        profile = request.user.profile
        serializer = AvatarUploadSerializer(profile, data=request.data)

        if serializer.is_valid():
            image = serializer.validated_data["avatar"]  # type: ignore

            image_content = image.read()

            upload_avatar_to_cloudinary.delay(str(profile.id), image_content)  # type: ignore

            return Response(
                {"message": "Avatar upload started."}, status=status.HTTP_202_ACCEPTED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TenantListAPIView(generics.ListAPIView):
    serializer_class = TenantSerializer
    renderer_classes = [GenericJSONRenderer]
    pagination_class = StandardResultsSetPagination
    object_label = "profiles"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["user__username", "user__first_name", "user__last_name"]
    filterset_fields = ["occupations__name", "gender", "city_of_origin"]

    def get_queryset(  # type: ignore
        self,
    ) -> QuerySet[Profile]:
        owned_apartments = Apartment.objects.filter(owner=self.request.user)
        tenants = User.objects.filter(rented_apartments__in=owned_apartments)

        return (
            Profile.objects.filter(user__in=tenants)
            .exclude(user__is_staff=True)
            .exclude(user__is_superuser=True)
        )


class NonTenantProfileListAPIView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    renderer_classes = [GenericJSONRenderer]
    pagination_class = StandardResultsSetPagination
    object_label = "non_tenant_profiles"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = [
        "user__username",
        "user__first_name",
        "user__last_name",
        "city_of_origin",
        "occupations__name",
    ]
    filterset_fields = ["occupations__name", "gender", "city_of_origin"]

    def get_queryset(self) -> QuerySet[Profile]:  # type: ignore
        return (
            Profile.objects.exclude(user__is_staff=True)
            .exclude(user__is_superuser=True)
            .exclude(occupations__name=Occupation.OccupationChoices.TENANT)
            .exclude(occupations__name=Occupation.OccupationChoices.OWNER)
            .filter(occupations__isnull=False)
            .distinct()
        )
