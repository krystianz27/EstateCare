import logging

import cloudinary.uploader

from core_apps.profiles.models import Profile

logger = logging.getLogger(__name__)


def save_profile(backend, user, response, *args, **kwargs):
    """
    Pipeline for Google OAuth2 login.
    Saves/updates the user's avatar in Cloudinary and stores it in the Profile model.
    """
    if backend.name != "google-oauth2":
        return  # This pipeline only works for Google OAuth2

    # Get the profile picture URL from Google's response
    avatar_url = response.get("picture", None)

    if not avatar_url:
        logger.info(f"No profile picture found for user: {user.email}")
        # set_default_avatar(user)  # Set the default avatar
        return

    # Upload the image to Cloudinary
    try:
        logger.info(f"Uploading profile picture for user {user.email} to Cloudinary...")
        upload_result = cloudinary.uploader.upload(
            avatar_url,
            # transformation={
            # "width": 150,
            # "height": 150,
            # "crop": "limit",
            # },  # Resize the image
        )
        logger.info(f"Success: Image uploaded to Cloudinary for user {user.email}")
    except Exception as e:
        logger.error(
            f"Error while uploading image to Cloudinary for user {user.email}: {e}"
        )
        # set_default_avatar(user)  # Set the default avatar if the upload fails
        return

    # Add or update the user's profile
    try:
        profile, created = Profile.objects.get_or_create(user=user)
        profile.avatar = upload_result.get(
            "public_id", ""
        )  # Save the public_id or an empty string if not available
        profile.save()
        logger.info(f"Profile updated for user {user.email} (avatar: {profile.avatar})")
    except Exception as e:
        logger.error(f"Error while saving the profile for user {user.email}: {e}")


def set_default_avatar(user):
    """
    Sets a default avatar for the user if Cloudinary upload fails
    or if no profile picture is found in the Google response.
    """
    try:
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.avatar = "default_avatar_url"  # Set the URL to the default avatar
        profile.save()
        logger.info(f"Default avatar set for user {user.email}")
    except Exception as e:
        logger.error(
            f"Error while setting the default avatar for user {user.email}: {e}"
        )
