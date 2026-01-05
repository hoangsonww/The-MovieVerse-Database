from __future__ import annotations

import json
import logging
import time

import pika

from crawler.tasks import crawl_movie_data_and_store
from movieverse_services.common.config import settings
from movieverse_services.common.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def _publish_retry(channel, payload: dict) -> None:
    channel.basic_publish(
        exchange="",
        routing_key=settings.crawler_queue_name,
        body=json.dumps(payload).encode("utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )


def _publish_dead_letter(channel, payload: dict) -> None:
    dlq = f"{settings.crawler_queue_name}.dlq"
    channel.queue_declare(queue=dlq, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=dlq,
        body=json.dumps(payload).encode("utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )


def handle_message(channel, method, properties, body) -> None:
    payload = json.loads(body)
    job_id = payload.get("job_id")
    url = payload.get("url")
    attempt = int(payload.get("attempt", 0))
    try:
        crawl_movie_data_and_store(url, payload.get("source"), payload.get("tags", []), job_id=job_id)
        channel.basic_ack(delivery_tag=method.delivery_tag)
        logger.info("crawler_job_completed", extra={"job_id": job_id, "url": url})
    except Exception as exc:
        logger.exception("crawler_job_failed", extra={"job_id": job_id, "url": url, "error": str(exc)})
        channel.basic_ack(delivery_tag=method.delivery_tag)
        if attempt + 1 <= settings.crawler_max_retries:
            payload["attempt"] = attempt + 1
            time.sleep(settings.crawler_retry_delay_seconds)
            _publish_retry(channel, payload)
        else:
            _publish_dead_letter(channel, payload)


def main() -> None:
    parameters = pika.URLParameters(settings.rabbitmq_url)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue=settings.crawler_queue_name, durable=True)
    channel.basic_qos(prefetch_count=settings.crawler_prefetch)

    channel.basic_consume(queue=settings.crawler_queue_name, on_message_callback=handle_message)
    logger.info("crawler_worker_started")
    channel.start_consuming()


if __name__ == "__main__":
    main()
