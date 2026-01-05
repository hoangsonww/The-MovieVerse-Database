from __future__ import annotations

import logging
import time

from fastapi import FastAPI
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import select
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.db import mysql_engine, postgres_engine, session_factory
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.common.search import index_movie, index_review
from movieverse_services.movie_service.models import Movie
from movieverse_services.review_service.models import Review
from movieverse_services.search_indexer_service.schemas import ReindexRequest

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="MovieVerse Search Indexer Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_search_indexer_requests_total",
    "Total requests to search indexer service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_search_indexer_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)

mysql_engine_instance = mysql_engine()
postgres_engine_instance = postgres_engine()
mysql_session = session_factory(mysql_engine_instance)
postgres_session = session_factory(postgres_engine_instance)


@app.on_event("shutdown")
def _shutdown() -> None:
    mysql_engine_instance.dispose()
    postgres_engine_instance.dispose()


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/reindex/movies")
def reindex_movies(payload: ReindexRequest):
    start = time.time()
    session = mysql_session()
    movies = []
    try:
        query = select(Movie)
        if payload.limit:
            query = query.limit(payload.limit)
        movies = session.execute(query).scalars().all()
        for movie in movies:
            index_movie(
                {
                    "movie_id": movie.movie_id,
                    "tmdb_id": movie.tmdb_id,
                    "title": movie.title,
                    "overview": movie.overview,
                    "genres": movie.genres,
                    "release_date": movie.release_date.isoformat() if movie.release_date else None,
                    "rating": movie.rating,
                    "popularity": movie.popularity,
                }
            )
    finally:
        session.close()

    request_counter.labels(endpoint="reindex_movies").inc()
    request_latency.labels(endpoint="reindex_movies").observe(time.time() - start)
    return {"status": "ok", "indexed": len(movies)}


@app.post("/reindex/reviews")
def reindex_reviews(payload: ReindexRequest):
    start = time.time()
    session = postgres_session()
    reviews = []
    try:
        query = select(Review)
        if payload.limit:
            query = query.limit(payload.limit)
        reviews = session.execute(query).scalars().all()
        for review in reviews:
            index_review(
                {
                    "review_id": review.review_id,
                    "movie_id": review.movie_id,
                    "user_id": review.user_id,
                    "review_text": review.review_text,
                    "rating": float(review.rating),
                    "created_at": review.created_at.isoformat(),
                }
            )
    finally:
        session.close()

    request_counter.labels(endpoint="reindex_reviews").inc()
    request_latency.labels(endpoint="reindex_reviews").observe(time.time() - start)
    return {"status": "ok", "indexed": len(reviews)}
