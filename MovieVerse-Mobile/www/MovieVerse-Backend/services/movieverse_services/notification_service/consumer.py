from __future__ import annotations

import json
import logging

import pika
from sqlalchemy import select
from sqlalchemy.orm import Session

from movieverse_services.common.config import settings
from movieverse_services.common.db import postgres_engine, session_factory
from movieverse_services.common.logging import configure_logging
from movieverse_services.notification_service.models import Notification

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = postgres_engine()
SessionLocal = session_factory(engine)


def process_message(body: bytes) -> None:
    payload = json.loads(body.decode("utf-8"))
    user_id = payload.get("user_id")
    message = payload.get("message")

    if not user_id or not message:
        logger.warning("notification_invalid", extra={"payload": payload})
        return

    session: Session = SessionLocal()
    try:
        notification = session.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .where(Notification.message == message)
            .order_by(Notification.created_at.desc())
        ).scalars().first()
        if notification:
            notification.status = "sent"
            session.commit()
            logger.info("notification_sent", extra={"user_id": user_id})
    finally:
        session.close()


def main() -> None:
    parameters = pika.URLParameters(settings.rabbitmq_url)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue="movieverse.notifications", durable=True)

    def callback(ch, method, properties, body):
        process_message(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue="movieverse.notifications", on_message_callback=callback)
    logger.info("notification_consumer_started")
    channel.start_consuming()


if __name__ == "__main__":
    main()
