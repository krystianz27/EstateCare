from os import getenv, path

from dotenv import load_dotenv

from .base import *  # noqa: F403
from .base import BASE_DIR

local_env_file = path.join(BASE_DIR, ".envs", ".env.local")

if path.isfile(local_env_file):
    load_dotenv(local_env_file)


SECRET_KEY = getenv("DJANGO_SECRET_KEY")

ADMIN_URL = getenv("DJANGO_ADMIN_URL")


ALLOWED_HOSTS = []

ADMINS = [
    ("Krystian Test", "krystiaann27@gmail.com"),
]
