build:
	docker compose -f local.yml up --build -d --remove-orphans

up:
	docker compose -f local.yml up -d

down:
	docker compose -f local.yml down

down-v:
	docker compose -f local.yml down -v

show-logs:
	docker compose -f local.yml logs

show-logs-api:
	docker compose -f local.yml logs api

makemigrations:
	docker compose -f local.yml run --rm api python manage.py makemigrations

migrate:
	docker compose -f local.yml run --rm api python manage.py migrate

collectstatic:
	docker compose -f local.yml run --rm api python manage.py collectstatic --no-input --clear

superuser:
	docker compose -f local.yml run --rm api python manage.py createsuperuser

db-volume:
	docker volume inspect backend_estate_prod_postgres_data

mailpit-volume:
	docker volume inspect backend_estate_prod_mailpit_data

estate-db:
	docker compose -f local.yml exec postgres psql --username=krystian --dbname=estate

start-pytest:
	docker-compose -f local.yml exec api pytest

api-sh:
	docker-compose -f local.yml exec api sh

api-sh-root:
	docker-compose -f local.yml exec -u root api sh

api-bash-root:
	docker-compose -f local.yml exec -u root api bash

client-sh-root:
	docker-compose -f local.yml exec -u root client sh

nginx-sh-root:
	docker-compose -f local.yml exec -u root nginx sh


