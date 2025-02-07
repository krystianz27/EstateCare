import pytest
from django.contrib.auth import get_user_model

from core_apps.profiles.models import Profile

User = get_user_model()


@pytest.mark.django_db
def test_create_user_profile_signal():
    # Given: A user is created
    user = User.objects.create_user(
        email="testuser@example.com",
        username="testuser",
        first_name="Test",
        last_name="User",
        password="securepassword123",
    )

    # When: The user is saved
    # No explicit action needed because post_save signal is triggered automatically.

    # Then: A Profile object should be created
    profile = Profile.objects.filter(user=user).first()
    assert profile is not None, "Profile was not created for the user"
    assert profile.user == user
    assert profile.slug == user.username, "Slug was not generated correctly"
