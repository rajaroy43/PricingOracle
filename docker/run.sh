#!/usr/bin/env bash

set -e

if ! which docker 2>&1 > /dev/null; then
    echo "Please install 'docker' first"
    exit 1
fi

if [ "$1" = "prod" ]; then
	echo "deploying to prod"

  AWS_ACCOUNT=INSERT AWS ACCOUNT HERE
  HOST=${AWS_ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com

  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${HOST}

  docker context use default

  # these are the names of the containers to tag and push
  # from the docker-compose.yml
	containers=(reward_coordinator reward_calculator)
	for container in "${containers[@]}"; do
	  # create aws ecr repo if not exists
    aws ecr create-repository --repository-name "${container}" || true
    cd "${container}"
    docker build -t "${container}" .
    docker tag "${container}":latest ${HOST}/"${container}":latest
    docker push ${HOST}/"${container}":latest
    cd ..
	done

  docker context use lithium

  docker compose --file docker-compose-aws.yml up

else
	# Create and launch all containers, including graph-node
	echo "deploying locally"
	docker compose -f docker-compose.yml -f graph-node/docker-compose.yml up --build 
fi


