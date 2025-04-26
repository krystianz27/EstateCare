from time import perf_counter

import pytest
from django.test import RequestFactory
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


@pytest.fixture
def user(db) -> User:
    return User.objects.create_user(
        username="testuser", email="testuser@example.com", password="testpassword"
    )


@pytest.fixture
def apartments_with_issues(user: User):
    apartments = []
    for i in range(100):
        apartment = Apartment.objects.create(
            street=f"Testowa {i}",
            building_number=str(i),
            city="TestCity",
            country="TestCountry",
            owner=user,
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
                reported_by=user,
                title=f"Issue {j} for apartment {i}",
                description=f"Description for issue {j} in apartment {i}",
                status=Issue.IssueStatus.REPORTED,
                priority=Issue.Priority.MEDIUM,
            )
        apartments.append(apartment)
    return apartments


def measure_queryset_time(view_class, request):
    view = view_class()
    view.request = request

    start_time = perf_counter()
    queryset = view.get_queryset()
    ApartmentSerializer(queryset, many=True).data
    end_time = perf_counter()

    elapsed_time = end_time - start_time
    print(f"Time execution {view_class.__name__}: {elapsed_time:.6f} seconds")


@pytest.mark.django_db
def test_queryset_performance(user, apartments_with_issues):
    factory = RequestFactory()
    request = factory.get("/apartments/?type=all")
    request.user = user
    force_authenticate(request, user=user)
    drf_request = Request(request)

    measure_queryset_time(ApartmentListCreateView, drf_request)
    measure_queryset_time(ApartmentListCreateViewUnoptimized, drf_request)
