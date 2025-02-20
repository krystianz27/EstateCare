import ssl
from os import getenv, path

import certifi
from dotenv import load_dotenv

from .base import *  # noqa: F403
from .base import BASE_DIR

local_env_file = path.join(BASE_DIR, ".envs", ".env.local")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)

DEBUG = True

SITE_NAME = getenv("SITE_NAME")

SECRET_KEY = getenv(
    "DJANGO_SECRET_KEY",
    "hDBRm2n03ugrbbaPst2OWFNHvL6blkGh0sWgU670HOEAq0Cnc4c",
)

CSRF_TRUSTED_ORIGINS = ["http://localhost:8080"]


ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "localhost:8080"]

USE_X_FORWARDED_HOST = True  #########################

ADMIN_URL = getenv("DJANGO_ADMIN_URL")

EMAIL_BACKEND = "djcelery_email.backends.CeleryEmailBackend"
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_PORT = getenv("EMAIL_PORT", 587)
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")
DOMAIN = getenv("DOMAIN")

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# # EMAIL_BACKEND = "djcelery_email.backends.CeleryEmailBackend"
# EMAIL_HOST = getenv("EMAIL_HOST")
# EMAIL_HOST_USER = getenv("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = getenv("EMAIL_HOST_PASSWORD")
# EMAIL_PORT = getenv("EMAIL_PORT")
# DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")
# EMAIL_USE_TLS = True
# EMAIL_USE_SSL = False
# DOMAIN = getenv("DOMAIN")
COOKIE_SECURE = getenv("COOKIE_SECURE") == "True"

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


ssl_context = ssl.create_default_context(cafile=certifi.where())
EMAIL_SSL_CONTEXT = ssl_context

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(name)-12s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
}
