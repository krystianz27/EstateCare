from time import perf_counter

import pytest
from django.db import connection
from django.test.utils import CaptureQueriesContext
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory, force_authenticate

from core_apps.apartments.models import Apartment
from core_apps.apartments.serializers import ApartmentSerializer
from core_apps.apartments.views import (
    ApartmentListCreateView,
    ApartmentListCreateViewUnoptimized,
)
from core_apps.issues.models import Issue
from core_apps.users.models import User


@pytest.fixture
def setup_data():
    user = User.objects.create(username="testuser", password="testpassword")
    factory = APIRequestFactory()

    for i in range(100):
        apartment = Apartment.objects.create(
            street=f"Test Street {i}",
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

    return user, factory


def measure_total_time(view_class, request):
    view = view_class()
    view.request = request

    start_time = perf_counter()
    queryset = view.get_queryset()
    ApartmentSerializer(queryset, many=True).data
    end_time = perf_counter()

    elapsed_time = end_time - start_time
    print(f"Time execution {view_class.__name__}: {elapsed_time:.6f} seconds")


def measure_serialization_details(queryset, view_name):
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


@pytest.mark.django_db
@pytest.mark.parametrize(
    "view_class, view_name",
    [
        (ApartmentListCreateView, ApartmentListCreateView.__name__),
        (
            ApartmentListCreateViewUnoptimized,
            ApartmentListCreateViewUnoptimized.__name__,
        ),
    ],
)
def test_queryset_and_serialization_performance(view_class, view_name, setup_data):
    user, factory = setup_data
    request = factory.get("/apartments/?type=all")
    request.user = user

    force_authenticate(request, user=user)
    drf_request = Request(request)

    print(f"\n===== {view_name} =====")
    measure_total_time(view_class, drf_request)

    view = view_class()
    view.request = drf_request
    queryset = view.get_queryset()
    measure_serialization_details(queryset, view_name)
