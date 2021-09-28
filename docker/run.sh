#!/usr/bin/env bash

set -e

if ! which docker 2>&1 > /dev/null; then
    echo "Please install 'docker' first"
    exit 1
fi

if [ "$1" = "prod" ]; then
	echo "deploying to prod"

  AWS_ACCOUNT=376538560806
  AWS_PROFILE=lith
  AWS_REGION=us-west-1
  HOST="${AWS_ACCOUNT}".dkr.ecr."${AWS_REGION}".amazonaws.com

  aws ecr --profile "${AWS_PROFILE}" --region "${AWS_REGION}" get-login-password | docker login --username AWS --password-stdin ${HOST}

  docker context use default

  # these are the names of the containers to tag and push
  # from the docker-compose.yml
	containers=(reward_coordinator reward_calculator)
	for container in "${containers[@]}"; do
	  # create aws ecr repo if not exists
    aws ecr --profile "${AWS_PROFILE}" --region "${AWS_REGION}" create-repository --repository-name "${container}" || true
    cd "${container}"
    docker build -t "${container}" .
    docker tag "${container}":latest ${HOST}/"${container}":latest
    docker push ${HOST}/"${container}":latest
    cd ..
	done

  docker context use lith

  docker compose --file docker-compose-aws-rinkeby-dev.yml up

else
	# Create and launch all containers, including graph-node
	echo "deploying locally"
	docker compose -f docker-compose.local.yml -f graph-node/docker-compose.yml up --build 
fi


