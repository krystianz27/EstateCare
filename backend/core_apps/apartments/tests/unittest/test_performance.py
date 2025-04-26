from time import perf_counter

from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.request import Request
from rest_framework.test import force_authenticate

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
                street=f"Testowa {i}",
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

    def measure_queryset_time(self, view_class, request):
        view = view_class()
        view.request = request

        start_time = perf_counter()
        # list(view.get_queryset())
        queryset = view.get_queryset()
        ApartmentSerializer(queryset, many=True).data
        end_time = perf_counter()

        elapsed_time = end_time - start_time
        print(f"\nTime execution {view_class.__name__}: {elapsed_time:.6f} seconds")

    def test_queryset_performance(self):
        # Create a request using RequestFactory and convert to DRF's Request
        request = self.factory.get("/apartments/?type=all")
        request.user = self.user

        force_authenticate(request, user=self.user)

        # Convert to DRF's Request object
        drf_request = Request(request)

        # Run tests with both views
        self.measure_queryset_time(ApartmentListCreateView, drf_request)

        self.measure_queryset_time(ApartmentListCreateViewUnoptimized, drf_request)
