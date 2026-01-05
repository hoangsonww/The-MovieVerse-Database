# MovieVerse AI Platform

MovieVerse-AI is a production-grade machine learning platform that powers recommendations, similarity search, sentiment analysis, and ranking for MovieVerse. It includes data ingestion, feature store, model training, registry, inference APIs, and monitoring.

## Capabilities

- Personalized recommendations (collaborative + content-aware)
- Movie similarity search using vector embeddings
- Review sentiment classification
- Ranking model for feed/search ordering
- Feature store with offline/online serving (Feast + Redis)
- MLflow model registry and experiment tracking
- Kafka-driven event ingestion
- Drift monitoring with Evidently

## Stack

- Python 3.11
- FastAPI + Uvicorn for online inference
- LightFM for recommender models
- SentenceTransformers + FAISS for embeddings
- scikit-learn for sentiment and ranking models
- Feast for feature storage
- MLflow for registry and experiments
- Kafka for event streaming
- PostgreSQL + MySQL + MongoDB data sources
- Redis online store

## Architecture

Online inference flow:

```mermaid
flowchart LR
  Backend[MovieVerse Backend] -->|HTTP| API[MovieVerse AI API]
  API --> Reco[Recommender Service]
  API --> Similar[Similarity + Embeddings]
  API --> Ranker[Ranking Service]
  API --> Sentiment[Sentiment Service]
  API --> Summarize[Summarization Service]
  API --> Vision[Vision Service]
  Reco --> Redis[(Redis Online Store)]
  Similar --> FAISS[(FAISS Index)]
  API --> Feast[Feature Store]
  Feast --> Redis
  Feast --> Postgres[(PostgreSQL Feature Repo)]
  API --> MLflow[(MLflow Registry)]
```

Training + feature pipeline flow:

```mermaid
flowchart TD
  Kafka[(Kafka Events)] --> Ingest[Event Ingestion]
  MySQL[(MySQL Movies)] --> Ingest
  Postgres[(PostgreSQL Ratings/Reviews)] --> Ingest
  Mongo[(Mongo Metadata)] --> Ingest
  Ingest --> Features[Build Feature Tables]
  Features --> Feast[Feast Feature Store]
  Feast --> Materialize[Materialize Online Features]
  Materialize --> Redis[(Redis Online Store)]
  Features --> Train[Train Models]
  Train --> MLflow[(MLflow Registry)]
  MLflow --> Sync[Sync Latest Models]
  Sync --> API[MovieVerse AI API]
```

## Directory Layout

```
MovieVerse-AI/
├── movieverse_ai/           # Core package (API, models, pipelines)
├── feature_repo/            # Feast feature store definitions
├── airflow/dags/            # Training + materialization workflows
├── sql/                     # Database schema for AI data
├── k8s/                     # Kubernetes deployment assets
├── docker-compose.ai.yml    # Local AI stack runtime
├── docker-compose.airflow.yml # Airflow scheduler/runtime
├── requirements.txt         # Production dependencies
└── Dockerfile               # Inference service image
```

## Services

- `movieverse_ai.api.main`: Online inference API
- `movieverse_ai.pipelines.ingest_events`: Kafka ingestion into Postgres
- `movieverse_ai.pipelines.train_recommender`: Recommendation training
- `movieverse_ai.pipelines.train_sentiment`: Review sentiment training
- `movieverse_ai.pipelines.build_ranking_features`: Ranking feature generation
- `movieverse_ai.pipelines.train_ranker`: Ranking model training
- `movieverse_ai.pipelines.build_embeddings`: Embedding + FAISS index
- `movieverse_ai.pipelines.build_feature_tables`: User/movie feature tables for Feast
- `movieverse_ai.pipelines.materialize_features`: Feast materialization
- `movieverse_ai.pipelines.sync_models`: Pull latest artifacts from MLflow
- `movieverse_ai.monitoring.drift_monitor`: Drift reports

## Local Run

1) Start the AI stack (Postgres, Redis, Kafka, MLflow, MinIO):

```bash
docker compose -f MovieVerse-AI/docker-compose.ai.yml up -d
```

The AI API is exposed at `http://localhost:9100` when running via Docker Compose.

2) Initialize the AI database schema:

```bash
psql postgresql://movieverse:movieverse@localhost:5433/movieverse_ai \
  -f MovieVerse-AI/sql/postgres_init.sql
```

3) (Optional) Start Airflow for scheduled pipelines:

```bash
psql postgresql://movieverse:movieverse@localhost:5433/postgres -c "CREATE DATABASE airflow"
docker compose -f MovieVerse-AI/docker-compose.airflow.yml up -d
```

Airflow connects to the AI stack over the `movieverse-ai` Docker network, so start the AI stack first.

4) Train models and build embeddings:

```bash
cd MovieVerse-AI
python -m movieverse_ai.pipelines.train_recommender
python -m movieverse_ai.pipelines.train_sentiment
python -m movieverse_ai.pipelines.build_ranking_features
python -m movieverse_ai.pipelines.train_ranker
python -m movieverse_ai.pipelines.build_embeddings
python -m movieverse_ai.pipelines.build_feature_tables
```

5) Start the inference API:

```bash
cd MovieVerse-AI
uvicorn movieverse_ai.api.main:app --host 0.0.0.0 --port 9000
```

## Environment Variables

All configuration is driven by `MOVIEVERSE_AI_` prefixed environment variables. Defaults are set for the local AI stack.

Key variables:

- `MOVIEVERSE_AI_POSTGRES_DSN`
- `MOVIEVERSE_AI_MYSQL_DSN`
- `MOVIEVERSE_AI_MONGO_URI`
- `MOVIEVERSE_AI_REDIS_URL`
- `MOVIEVERSE_AI_KAFKA_BOOTSTRAP_SERVERS`
- `MOVIEVERSE_AI_MLFLOW_TRACKING_URI`
- `MOVIEVERSE_AI_S3_ENDPOINT_URL`

## Production Deployment

- Kubernetes manifests live in `MovieVerse-AI/k8s/` and deploy the inference API.
- Use managed AWS services (RDS, MSK, OpenSearch, ElastiCache) and point the AI stack to them via environment variables.
- MLflow artifacts are stored in S3/MinIO; align this with the same bucket used in your infra stack.

## Data Requirements

The AI pipelines expect these tables:

- `ratings` (user_id, movie_id, rating, created_at)
- `reviews` (user_id, movie_id, rating, review_text, created_at)
- `ranking_features` (movie_id, popularity, avg_rating, rating_count, recency_days, label)
- `user_features` and `movie_features` for Feast

Movie metadata is sourced from MySQL `movies` (movie_id, title, overview, genres, release_date).

## API Endpoints

- `GET /healthz`
- `GET /metrics`
- `POST /recommendations`
- `POST /similar`
- `POST /sentiment`
- `POST /rank`
- `POST /summarize`
- `POST /genres/classify`
- `POST /vision/labels`
