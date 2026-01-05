from __future__ import annotations

from dataclasses import dataclass
import os


def _env(name: str, default: str) -> str:
    return os.getenv(name, default)


def _env_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None or value.strip() == "":
        return default
    return int(value)


@dataclass(frozen=True)
class DatabaseConfig:
    data_platform_url: str
    seed_token: str
    seed_user_password: str
    postgres_dsn: str
    mysql_dsn: str
    mongo_uri: str
    redis_url: str
    rabbitmq_url: str
    kafka_bootstrap_servers: str
    opensearch_url: str
    http_timeout_seconds: int


def load_config() -> DatabaseConfig:
    return DatabaseConfig(
        data_platform_url=_env("MOVIEVERSE_DATA_PLATFORM_URL", "http://localhost:8000"),
        seed_token=_env("MOVIEVERSE_SEED_TOKEN", ""),
        seed_user_password=_env("MOVIEVERSE_SEED_USER_PASSWORD", ""),
        postgres_dsn=_env(
            "MOVIEVERSE_POSTGRES_DSN",
            "postgresql+psycopg2://movieverse:movieverse@postgres:5432/movieverse",
        ),
        mysql_dsn=_env(
            "MOVIEVERSE_MYSQL_DSN",
            "mysql+pymysql://movieverse:movieverse@mysql:3306/movieverse",
        ),
        mongo_uri=_env("MOVIEVERSE_MONGO_URI", "mongodb://movieverse:movieverse@mongodb:27017"),
        redis_url=_env("MOVIEVERSE_REDIS_URL", "redis://redis:6379/0"),
        rabbitmq_url=_env("MOVIEVERSE_RABBITMQ_URL", "amqp://movieverse:movieverse@rabbitmq:5672/"),
        kafka_bootstrap_servers=_env("MOVIEVERSE_KAFKA_BOOTSTRAP_SERVERS", "kafka:9092"),
        opensearch_url=_env("MOVIEVERSE_OPENSEARCH_URL", "http://opensearch:9200"),
        http_timeout_seconds=_env_int("MOVIEVERSE_HTTP_TIMEOUT_SECONDS", 20),
    )
