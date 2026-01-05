from __future__ import annotations

import logging
import time

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
from movieverse_services.common.search import index_movie, index_review, search_movies, search_reviews
from movieverse_services.search_service.schemas import (
    IndexRequest,
    SearchRequest,
    ReviewIndexRequest,
    ReviewSearchRequest,
)

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="MovieVerse Search Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_search_requests_total",
    "Total requests to search service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_search_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/index")
def index(payload: IndexRequest):
    start = time.time()
    index_movie(payload.model_dump())
    request_counter.labels(endpoint="index").inc()
    request_latency.labels(endpoint="index").observe(time.time() - start)
    return {"status": "indexed", "movie_id": payload.movie_id}


@app.post("/search")
def search(payload: SearchRequest):
    start = time.time()
    results = search_movies(payload.query, payload.limit)
    request_counter.labels(endpoint="search").inc()
    request_latency.labels(endpoint="search").observe(time.time() - start)
    return {"query": payload.query, "results": results}


@app.post("/index/review")
def index_review_document(payload: ReviewIndexRequest):
    start = time.time()
    index_review(payload.model_dump())
    request_counter.labels(endpoint="index_review").inc()
    request_latency.labels(endpoint="index_review").observe(time.time() - start)
    return {"status": "indexed", "review_id": payload.review_id}


@app.post("/search/reviews")
def search_review_documents(payload: ReviewSearchRequest):
    start = time.time()
    results = search_reviews(payload.query, payload.limit)
    request_counter.labels(endpoint="search_reviews").inc()
    request_latency.labels(endpoint="search_reviews").observe(time.time() - start)
    return {"query": payload.query, "results": results}
