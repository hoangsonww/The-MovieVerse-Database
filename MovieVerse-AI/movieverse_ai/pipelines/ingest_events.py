from __future__ import annotations

import json
import logging
from datetime import datetime

from kafka import KafkaConsumer
from sqlalchemy import text

from movieverse_ai.config import settings
from movieverse_ai.data.sources import get_postgres_engine
from movieverse_ai.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def ingest() -> None:
    consumer = KafkaConsumer(
        settings.kafka_events_topic,
        bootstrap_servers=settings.kafka_bootstrap_servers,
        group_id=settings.kafka_consumer_group,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        enable_auto_commit=True,
        auto_offset_reset="latest",
    )

    engine = get_postgres_engine()
    logger.info("event_ingest_started")

    insert_stmt = text(
        """
        INSERT INTO user_events
            (event_id, user_id, movie_id, event_type, rating, event_time, metadata)
        VALUES
            (:event_id, :user_id, :movie_id, :event_type, :rating, :event_time, :metadata)
        ON CONFLICT (event_id) DO NOTHING
        """
    )

    for message in consumer:
        payload = message.value
        event = {
            "event_id": payload.get("event_id"),
            "user_id": payload.get("user_id"),
            "movie_id": payload.get("movie_id"),
            "event_type": payload.get("event_type"),
            "rating": payload.get("rating"),
            "event_time": payload.get("event_time") or datetime.utcnow().isoformat(),
            "metadata": json.dumps(payload.get("metadata", {})),
        }
        if not event["event_id"]:
            logger.warning("event_missing_id", extra={"payload": payload})
            continue
        with engine.begin() as conn:
            conn.execute(insert_stmt, event)


if __name__ == "__main__":
    ingest()
