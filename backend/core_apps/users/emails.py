import logging

from config.settings.local import DEFAULT_FROM_EMAIL, SITE_NAME
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_welcome_email(user) -> None:
    try:
        subject = "Welcome to Our Platform!"
        context = {
            "user": user,
            "site_name": SITE_NAME,
            "password": user.password,
        }

        html_email = render_to_string("emails/welcome_email.html", context)

        text_email = strip_tags(html_email)

        from_email = DEFAULT_FROM_EMAIL
        to = [user.email]

        email = EmailMultiAlternatives(subject, text_email, from_email, to)
        email.attach_alternative(html_email, "text/html")

        email.send()

        logger.info(f"Welcome email sent to {user.email}")

    except Exception as e:
        logger.error(
            f"Error sending welcome email to {user.email}: {str(e)}",
            exc_info=True,
        )
