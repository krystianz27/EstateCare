from os import getenv, path

from dotenv import load_dotenv

from .base import *  # noqa: F403
from .base import BASE_DIR

prod_env_file = path.join(BASE_DIR, ".envs", ".env.production")

if path.isfile(prod_env_file):
    load_dotenv(prod_env_file)

DEBUG = False

SECRET_KEY = getenv("DJANGO_SECRET_KEY")

ADMIN_URL = getenv("DJANGO_ADMIN_URL")


ALLOWED_HOSTS = [
    "61.126.36.82",
    "localhost",
]

CSRF_TRUSTED_ORIGINS = [
    "http://61.126.36.82",
    # 'https://yourdomain.com',
]

ADMINS = [
    ("Krystian Test", "krystiaann27@gmail.com"),
]

EMAIL_BACKEND = "djcelery_email.backends.CeleryEmailBackend"
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_HOST_USER = getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = getenv("EMAIL_HOST_PASSWORD")
EMAIL_PORT = getenv("EMAIL_PORT")
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DOMAIN = getenv("DOMAIN")
COOKIE_SECURE = getenv("COOKIE_SECURE") == "True"

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Forward HTTP to HTTPS
# SECURE_SSL_REDIRECT = getenv("SECURE_SSL_REDIRECT", "True") == "True"

# CSRF_COOKIE_SECURE = True

# SECURE_HSTS_SECOND = 300
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = getenv("SECURE_CONTENT_TYPE", "True") == "True"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "filters": {"require_debug_false": {"()": "django.utils.log.RequireDebugFalse"}},
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(name)-12s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "level": "INFO",
        "handlers": ["console"],
    },
    "loggers": {
        "django.request": {
            "handlers": ["mail_admins"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.security.DisallowedHost": {
            "handlers": ["console", "mail_admins"],
            "level": "ERROR",
            "propagate": True,
        },
    },
}
