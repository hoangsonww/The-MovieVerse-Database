# MovieVerse Backend Microservices

This directory contains the production-ready microservices implementation for MovieVerse. Each service is built with FastAPI and shares common infrastructure modules (logging, DB, events, security).

## Services

- `auth_service`: Authentication and JWT issuance
- `user_service`: User profiles and preferences
- `movie_service`: Movie catalog and metadata
- `review_service`: Ratings and reviews with event emission
- `search_service`: OpenSearch-backed search
- `search_indexer_service`: Kafka-driven search indexing + reindex endpoints
- `notification_service`: Notification API + RabbitMQ consumer
- `recommendation_service`: AI-backed recommendations
- `crawler_service`: URL crawl orchestration + RabbitMQ worker
- `metadata_service`: Mongo-backed genres/people/analysis store
- `data_platform_service`: TMDB ingestion, health checks, controlled seeding

## Build

All services are built from the shared Dockerfile with a service module argument:

```bash
docker build \
  --build-arg SERVICE_MODULE=movieverse_services.auth_service.main \
  -f MovieVerse-Backend/services/Dockerfile \
  -t movieverse/auth-service:latest .
```

## Database Schema

SQL definitions are available in `MovieVerse-Backend/services/sql/`:

- `postgres_init.sql`
- `mysql_init.sql`

## Local Run

Use the root `docker-compose.microservices.yml` to run the full stack including Redis, Kafka, RabbitMQ, Postgres, MySQL, OpenSearch, and the AI service.

For local execution without Docker, add the middleware package to your `PYTHONPATH`:

```bash
export PYTHONPATH=$PYTHONPATH:$(pwd)/../../MovieVerse-Middleware
```

## Configuration

Key environment variables:

- `MOVIEVERSE_ENVIRONMENT`: `development` or `production`
- `MOVIEVERSE_AUTO_MIGRATE`: `true` in dev, must be `false` in production
- `MOVIEVERSE_JWT_SECRET`: JWT signing secret (required in production)
- `MOVIEVERSE_ALLOW_SEEDING`, `MOVIEVERSE_SEED_TOKEN`: gated bootstrap endpoints
- `MOVIEVERSE_POSTGRES_DSN`, `MOVIEVERSE_MYSQL_DSN`, `MOVIEVERSE_REDIS_URL`
- `MOVIEVERSE_KAFKA_BOOTSTRAP_SERVERS`, `MOVIEVERSE_RABBITMQ_URL`
- `MOVIEVERSE_RABBITMQ_EVENTS_QUEUE`, `MOVIEVERSE_RABBITMQ_NOTIFICATIONS_QUEUE`
- `MOVIEVERSE_OPENSEARCH_URL`, `MOVIEVERSE_TMDB_API_KEY`
