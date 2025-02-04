#!/bin/bash

set -e

if [ -z "DIGITAL_OCEAN_IP_ADDRESS" ]; then
  echo "Please set the DIGITAL_OCEAN_IP_ADDRESS environment variable"
  exit 1
fi

cleanup_local() {
    echo "Cleaning up local files..."
    rm -rf ./project.tar
}

trap cleanup_local EXIT

echo "Packaging project files..."
git archive --format tar --output ./project.tar main

ENV_FILE="./.envs/.env.production"
if [ -f "$ENV_FILE" ]; then
  echo "Adding $ENV_FILE to archive..."
  # tar --append --file=project.tar -C ./.envs "$(basename "$ENV_FILE")"
  tar --append --file=project.tar -C . ".envs/.env.production"
else
  echo "Warning: $ENV_FILE not found!"
fi

echo "Uploading project to Digital Ocean..."

# rsync -avz --progress ./project.tar root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project.tar
scp ./project.tar root@$DIGITAL_OCEAN_IP_ADDRESS:/tmp/project.tar

echo "Building and deploying project..."

ssh -o StrictHostKeyChecking=no root@$DIGITAL_OCEAN_IP_ADDRESS <<'ENDSSH'

set -e

cleanup_remote() {
    echo "Cleaning up remote files..."
    rm -rf /tmp/project.tar
    rm -rf /app
}

trap cleanup_remote EXIT

TEMP_DIR=$(mktemp -d)
echo "Extracting project to $TEMP_DIR"
tar -xf /tmp/project.tar -C "$TEMP_DIR"

if [ -f "$TEMP_DIR/.envs/.env.production" ]; then
  echo ".env.production found, proceeding..."
else
  echo "Warning: .env.production not found in extracted files"
fi

echo "Stopping and removing existing containers..."
docker compose -f "$TEMP_DIR/production.yml" down --remove-orphans

echo "Pruning unused Docker resources..."
docker system prune -af

echo "Restarting Docker service to ensure all ports are free..."
systemctl is-active --quiet docker || sudo systemctl start docker
sudo systemctl restart docker

echo "Building and starting new containers..."
docker compose -f "$TEMP_DIR/production.yml" up --build -d --remove-orphans

ENDSSH

echo "Deployment completed successfully."