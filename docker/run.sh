#!/usr/bin/env bash

set -e

if ! which docker 2>&1 > /dev/null; then
    echo "Please install 'docker' first"
    exit 1
fi

# Create and launch all containers, including graph-node
docker compose -f docker-compose.yml -f graph-node/docker-compose.yml up --build --force-recreate

