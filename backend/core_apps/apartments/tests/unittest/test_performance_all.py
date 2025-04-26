from time import perf_counter

from django.db import connection
from django.test import TestCase
from django.test.client import RequestFactory
from django.test.utils import CaptureQueriesContext
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate

from core_apps.apartments.models import Apartment
from core_apps.apartments.serializers import ApartmentSerializer
from core_apps.apartments.views import (
    ApartmentListCreateView,
    ApartmentListCreateViewUnoptimized,
)
from core_apps.issues.models import Issue
from core_apps.users.models import User


class TestApartmentQueryPerformance(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser", password="testpassword")
        self.factory = RequestFactory()

        for i in range(100):
            apartment = Apartment.objects.create(
                street=f"Test Street {i}",
                building_number=str(i),
                city="TestCity",
                country="TestCountry",
                owner=self.user,
                apartment_number=f"APT{i}",
                postal_code=f"1234{i}",
            )

            tenant = User.objects.create_user(
                username=f"tenant{i}",
                email=f"tenant{i}@example.com",
                password="password123",
            )
            apartment.tenants.add(tenant)

            for j in range(3):
                Issue.objects.create(
                    apartment=apartment,
                    reported_by=self.user,
                    title=f"Issue {j} for apartment {i}",
                    description=f"Description for issue {j} in apartment {i}",
                    status=Issue.IssueStatus.REPORTED,
                    priority=Issue.Priority.MEDIUM,
                )

    def measure_total_time(self, view_class, request):
        view = view_class()
        view.request = request

        start_time = perf_counter()
        queryset = view.get_queryset()
        ApartmentSerializer(queryset, many=True).data
        end_time = perf_counter()

        elapsed_time = end_time - start_time
        print(f"Time execution {view_class.__name__}: {elapsed_time:.6f} seconds")

    def measure_serialization_details(self, queryset, view_name):
        with CaptureQueriesContext(connection) as ctx:
            start_time = perf_counter()
            serializer = ApartmentSerializer(queryset, many=True)
            _ = serializer.data
            end_time = perf_counter()

        elapsed_time = end_time - start_time
        print(f"Serialization time {view_name}: {elapsed_time:.6f} seconds")
        print(
            f"Number of SQL queries during serialization {view_name}: {len(ctx.captured_queries)}"
        )

    def test_queryset_and_serialization_performance(self):
        request = self.factory.get("/apartments/?type=all")
        request.user = self.user

        force_authenticate(request, user=self.user)
        drf_request = Request(request)

        print(f"\n===== {ApartmentListCreateView.__name__} =====")
        self.measure_total_time(ApartmentListCreateView, drf_request)

        view_normal = ApartmentListCreateView()
        view_normal.request = drf_request  # type: ignore
        queryset_normal = view_normal.get_queryset()
        self.measure_serialization_details(
            queryset_normal, ApartmentListCreateView.__name__
        )

        print(f"\n===== {ApartmentListCreateViewUnoptimized.__name__} =====")
        self.measure_total_time(ApartmentListCreateViewUnoptimized, drf_request)

        view_optimized = ApartmentListCreateViewUnoptimized()
        view_optimized.request = drf_request  # type: ignore
        queryset_optimized = view_optimized.get_queryset()
        self.measure_serialization_details(
            queryset_optimized, ApartmentListCreateViewUnoptimized.__name__
        )


class TestApartmentViewResponse(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = self.create_test_user()

    def create_test_user(self):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        return User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass"
        )

    def test_apartment_list_create_view_response(self):
        request = self.factory.get("/apartments/?type=all")
        force_authenticate(request, user=self.user)

        view = ApartmentListCreateView.as_view()
        response = view(request)

        # Teraz sprawdzamy odpowiedź
        assert response.status_code == 200
        assert isinstance(response.data, dict)  # type: ignore
        assert isinstance(response.data["results"], list)  # type: ignore

        print(f"\n===== {ApartmentListCreateView.__name__} RESPONSE =====")
        print(f"Status code: {response.status_code}")
        print(f"Number of apartments returned: {len(response.data['results'])}")  # type: ignore

    def test_apartment_list_create_view_unoptimized_response(self):
        request = self.factory.get("/apartments/?type=all")
        force_authenticate(request, user=self.user)

        view = ApartmentListCreateViewUnoptimized.as_view()
        response = view(request)

        # Sprawdzamy odpowiedź
        assert response.status_code == 200
        assert isinstance(response.data, dict)  # type: ignore
        assert isinstance(response.data["results"], list)  # type: ignore

        print(f"\n===== {ApartmentListCreateViewUnoptimized.__name__} RESPONSE =====")
        print(f"Status code: {response.status_code}")
        print(f"Number of apartments returned: {len(response.data['results'])}")  # type: ignore
