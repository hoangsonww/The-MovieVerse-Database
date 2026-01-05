from __future__ import annotations

import json
import logging
import time
import uuid

import pika
from fastapi import FastAPI
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.crawler_service.schemas import CrawlBatchRequest, CrawlRequest, CrawlResponse

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="MovieVerse Crawler Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_crawler_requests_total",
    "Total requests to crawler service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_crawler_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)


def _publish_job(payload: dict) -> None:
    parameters = pika.URLParameters(settings.rabbitmq_url)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue=settings.crawler_queue_name, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=settings.crawler_queue_name,
        body=json.dumps(payload).encode("utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    connection.close()


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/crawl", response_model=CrawlResponse)
def crawl(payload: CrawlRequest):
    start = time.time()
    job_id = uuid.uuid4().hex
    message = {
        "job_id": job_id,
        "url": str(payload.url),
        "source": payload.source,
        "tags": payload.tags or [],
        "priority": payload.priority,
        "attempt": 0,
    }
    _publish_job(message)

    request_counter.labels(endpoint="crawl").inc()
    request_latency.labels(endpoint="crawl").observe(time.time() - start)
    return CrawlResponse(job_id=job_id, url=str(payload.url))


@app.post("/crawl/batch")
def crawl_batch(payload: CrawlBatchRequest):
    start = time.time()
    results = []
    for url in payload.urls:
        job_id = uuid.uuid4().hex
        message = {
            "job_id": job_id,
            "url": str(url),
            "source": payload.source,
            "tags": payload.tags or [],
            "priority": payload.priority,
            "attempt": 0,
        }
        _publish_job(message)
        results.append(CrawlResponse(job_id=job_id, url=str(url)))

    request_counter.labels(endpoint="crawl_batch").inc()
    request_latency.labels(endpoint="crawl_batch").observe(time.time() - start)
    return {"jobs": [result.model_dump() for result in results]}
