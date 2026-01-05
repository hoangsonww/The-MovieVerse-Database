from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MOVIEVERSE_", case_sensitive=False)

    service_name: str = Field(default="movieverse-service")
    environment: str = Field(default="development")
    log_level: str = Field(default="INFO")
    host: str = Field(default="0.0.0.0")
    port: int = Field(default=8000)
    auto_migrate: bool = Field(default=True)
    db_pool_size: int = Field(default=10)
    db_max_overflow: int = Field(default=20)
    db_pool_recycle_seconds: int = Field(default=1800)

    postgres_dsn: str = Field(
        default="postgresql+psycopg2://movieverse:movieverse@postgres:5432/movieverse"
    )
    mysql_dsn: str = Field(
        default="mysql+pymysql://movieverse:movieverse@mysql:3306/movieverse"
    )
    redis_url: str = Field(default="redis://redis:6379/0")

    kafka_bootstrap_servers: str = Field(default="kafka:9092")
    kafka_events_topic: str = Field(default="movieverse.events")

    rabbitmq_url: str = Field(default="amqp://movieverse:movieverse@rabbitmq:5672/")
    rabbitmq_events_queue: str = Field(default="movieverse.events")
    rabbitmq_notifications_queue: str = Field(default="movieverse.notifications")

    opensearch_url: str = Field(default="http://opensearch:9200")
    opensearch_index: str = Field(default="movieverse-movies")
    opensearch_reviews_index: str = Field(default="movieverse-reviews")

    ai_service_url: str = Field(default="http://movieverse-ai-api.movieverse.svc.cluster.local:9000")
    metadata_service_url: str = Field(default="http://metadata-service:8000")
    auth_service_url: str = Field(default="http://auth-service:8000")
    user_service_url: str = Field(default="http://user-service:8000")
    movie_service_url: str = Field(default="http://movie-service:8000")
    review_service_url: str = Field(default="http://review-service:8000")
    search_service_url: str = Field(default="http://search-service:8000")

    mongo_uri: str = Field(default="mongodb://movieverse:movieverse@mongodb:27017")
    mongo_db: str = Field(default="movieverse")

    tmdb_api_key: str = Field(default="")
    tmdb_base_url: str = Field(default="https://api.themoviedb.org/3")

    crawler_queue_name: str = Field(default="movieverse.crawler")
    crawler_prefetch: int = Field(default=4)
    crawler_max_retries: int = Field(default=3)
    crawler_retry_delay_seconds: int = Field(default=15)
    crawler_user_agent: str = Field(default="MovieVerseCrawler/1.0")
    crawler_timeout_seconds: int = Field(default=15)
    crawler_system_user_id: int = Field(default=0)

    seed_token: str = Field(default="")
    allow_seed_operations: bool = Field(default=False)

    jwt_secret: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")
    jwt_exp_minutes: int = Field(default=60)
    refresh_exp_hours: int = Field(default=168)


settings = Settings()


def _validate_settings(config: Settings) -> None:
    if config.environment == "production" and config.jwt_secret in {"", "change-me", "movieverse"}:
        raise RuntimeError("MOVIEVERSE_JWT_SECRET must be set for production.")
    if config.environment == "production" and config.auto_migrate:
        raise RuntimeError("MOVIEVERSE_AUTO_MIGRATE must be false in production.")
    if config.allow_seed_operations and not config.seed_token:
        raise RuntimeError("MOVIEVERSE_SEED_TOKEN must be set when seeding is enabled.")


_validate_settings(settings)
