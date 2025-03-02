#!/bin/bash

set -o errexit

set -o pipefail

set -o nounset


# python manage.py makemigrations --no-input
python manage.py migrate --no-input
python manage.py collectstatic --no-input

# exec python manage.py runserver 0.0.0.0:8000
# exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
exec watchfiles "daphne -b 0.0.0.0 -p 8000 config.asgi:application" --filter python
