from time import perf_counter

import pytest
from rest_framework.test import APIClient

from core_apps.apartments.models import Apartment
from core_apps.apartments.views import (
    ApartmentListCreateView,
    ApartmentListCreateViewUnoptimized,
)
from core_apps.issues.models import Issue
from core_apps.users.models import User


@pytest.fixture
def user(db):
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


@pytest.fixture
def authenticated_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
@pytest.mark.parametrize(
    "view_class, url",
    [
        (ApartmentListCreateView, "/api/v1/apartments/"),
        (ApartmentListCreateViewUnoptimized, "/api/v1/apartments/unoptimized/"),
    ],
)
def test_apartment_queryset_performance(
    authenticated_client, view_class, url, apartments_with_issues
):
    start_time = perf_counter()

    response = authenticated_client.get(url)

    elapsed_time = perf_counter() - start_time
    print(
        f"\n[Performance] {view_class.__name__} executed in {elapsed_time:.6f} seconds"
    )

    assert (
        response.status_code == 200
    ), f"Expected status code 200, got {response.status_code}"

    assert (
        elapsed_time < 3.0
    ), f"{view_class.__name__} is too slow! ({elapsed_time:.2f}s)"
