from __future__ import annotations

import json
import logging

import pika
from kafka import KafkaProducer
from kafka.errors import KafkaError

from movieverse_services.common.config import settings

logger = logging.getLogger(__name__)


_producer: KafkaProducer | None = None


def kafka_producer() -> KafkaProducer:
    global _producer
    if _producer is None:
        _producer = KafkaProducer(
            bootstrap_servers=settings.kafka_bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            acks="all",
            retries=3,
            linger_ms=5,
            client_id=settings.service_name,
        )
    return _producer


def publish_kafka_event(event_type: str, payload: dict) -> None:
    producer = kafka_producer()
    message = {"type": event_type, **payload}
    try:
        producer.send(settings.kafka_events_topic, message).get(timeout=5)
        logger.info("kafka_event_published", extra={"event_type": event_type})
    except KafkaError as exc:
        logger.warning("kafka_event_failed", extra={"event_type": event_type, "error": str(exc)})


def rabbitmq_channel():
    parameters = pika.URLParameters(settings.rabbitmq_url)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue=settings.rabbitmq_notifications_queue, durable=True)
    return connection, channel


def publish_notification(message: dict) -> None:
    connection, channel = rabbitmq_channel()
    channel.basic_publish(
        exchange="",
        routing_key=settings.rabbitmq_notifications_queue,
        body=json.dumps(message).encode("utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    connection.close()
    logger.info("notification_published", extra={"user_id": message.get("user_id")})
