#!/usr/bin/env bash
set -euo pipefail

REGISTRY=${REGISTRY:?REGISTRY is required}
IMAGE_TAG=${IMAGE_TAG:?IMAGE_TAG is required}

services=(
  auth-service
  user-service
  movie-service
  review-service
  search-service
  search-indexer-service
  notification-service
  recommendation-service
  metadata-service
  crawler-service
  data-platform-service
  ai-api
)

for service in "${services[@]}"; do
  if [[ "$service" == "ai-api" ]]; then
    docker build -f MovieVerse-AI/Dockerfile -t "$REGISTRY/$service:$IMAGE_TAG" .
  else
    module="movieverse_services.${service//-/_}.main"
    docker build \
      --build-arg SERVICE_MODULE="$module" \
      -f MovieVerse-Backend/services/Dockerfile \
      -t "$REGISTRY/$service:$IMAGE_TAG" .
  fi
  docker push "$REGISTRY/$service:$IMAGE_TAG"
  docker tag "$REGISTRY/$service:$IMAGE_TAG" "$REGISTRY/$service:latest"
  docker push "$REGISTRY/$service:latest"
done
