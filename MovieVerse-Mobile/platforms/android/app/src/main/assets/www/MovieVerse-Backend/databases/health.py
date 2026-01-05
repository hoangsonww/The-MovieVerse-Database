from __future__ import annotations

from typing import Callable

from kafka import KafkaProducer
from opensearchpy import OpenSearch
import pika
import redis
from pymongo import MongoClient
from sqlalchemy import create_engine, text

from .config import DatabaseConfig


def _safe_check(checker: Callable[[], None]) -> tuple[str, str | None]:
    try:
        checker()
        return "ok", None
    except Exception as exc:  # pragma: no cover - runtime connectivity checks
        return "error", str(exc)


def check_postgres(dsn: str) -> tuple[str, str | None]:
    def _check() -> None:
        engine = create_engine(dsn, pool_pre_ping=True)
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        finally:
            engine.dispose()

    return _safe_check(_check)


def check_mysql(dsn: str) -> tuple[str, str | None]:
    def _check() -> None:
        engine = create_engine(dsn, pool_pre_ping=True)
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        finally:
            engine.dispose()

    return _safe_check(_check)


def check_redis(url: str) -> tuple[str, str | None]:
    def _check() -> None:
        client = redis.Redis.from_url(url, decode_responses=True)
        client.ping()

    return _safe_check(_check)


def check_mongo(uri: str) -> tuple[str, str | None]:
    def _check() -> None:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        try:
            client.admin.command("ping")
        finally:
            client.close()

    return _safe_check(_check)


def check_rabbitmq(url: str) -> tuple[str, str | None]:
    def _check() -> None:
        connection = pika.BlockingConnection(pika.URLParameters(url))
        connection.close()

    return _safe_check(_check)


def check_kafka(bootstrap_servers: str) -> tuple[str, str | None]:
    def _check() -> None:
        producer = KafkaProducer(bootstrap_servers=bootstrap_servers, api_version_auto_timeout_ms=5000)
        try:
            if not producer.bootstrap_connected():
                raise RuntimeError("Kafka bootstrap connection failed")
        finally:
            producer.close()

    return _safe_check(_check)


def check_opensearch(url: str) -> tuple[str, str | None]:
    def _check() -> None:
        client = OpenSearch(hosts=[url])
        client.cluster.health()

    return _safe_check(_check)


def health_report(config: DatabaseConfig, include_errors: bool = False) -> tuple[dict, dict | None]:
    checks: dict[str, str] = {}
    errors: dict[str, str] = {}

    for name, fn, arg in [
        ("postgres", check_postgres, config.postgres_dsn),
        ("mysql", check_mysql, config.mysql_dsn),
        ("redis", check_redis, config.redis_url),
        ("mongo", check_mongo, config.mongo_uri),
        ("rabbitmq", check_rabbitmq, config.rabbitmq_url),
        ("kafka", check_kafka, config.kafka_bootstrap_servers),
        ("opensearch", check_opensearch, config.opensearch_url),
    ]:
        status, error = fn(arg)
        checks[name] = status
        if error:
            errors[name] = error

    if include_errors:
        return checks, errors
    return checks, None
