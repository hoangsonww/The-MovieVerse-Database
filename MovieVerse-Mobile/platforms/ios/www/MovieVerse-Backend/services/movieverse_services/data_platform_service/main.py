from __future__ import annotations

import json
import logging
import random
import time

import httpx
import pika
import redis
from faker import Faker
from fastapi import FastAPI, Header, HTTPException
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
from movieverse_services.data_platform_service.schemas import (
    PublishMessageRequest,
    SeedReviewsRequest,
    SeedUsersRequest,
    TmdbIngestRequest,
)
from movieverse_services.data_platform_service.tmdb_client import TmdbClient
from databases.config import load_config
from databases.health import health_report

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="MovieVerse Data Platform Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_data_platform_requests_total",
    "Total requests to data platform service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_data_platform_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)

faker = Faker()
redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)


def _require_seed_token(token: str | None) -> None:
    if not settings.allow_seed_operations:
        raise HTTPException(status_code=403, detail="Seed operations are disabled")
    if not settings.seed_token:
        raise HTTPException(status_code=403, detail="Seed token is not configured")
    if token != settings.seed_token:
        raise HTTPException(status_code=403, detail="Invalid seed token")


def _http_client(base_url: str) -> httpx.Client:
    return httpx.Client(base_url=base_url, timeout=20.0)


@app.get("/healthz")
def healthcheck():
    start = time.time()
    checks, errors = health_report(load_config(), include_errors=True)
    for name, error in (errors or {}).items():
        logger.warning("healthcheck_failed", extra={"service": name, "error": error})

    status = "ok" if all(value == "ok" for value in checks.values()) else "degraded"
    request_counter.labels(endpoint="healthz").inc()
    request_latency.labels(endpoint="healthz").observe(time.time() - start)
    return {"status": status, "checks": checks}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/ingest/tmdb/movies")
def ingest_tmdb_movies(payload: TmdbIngestRequest):
    start = time.time()
    try:
        client = TmdbClient()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    genre_lookup = {genre["id"]: genre["name"] for genre in client.fetch_genres(payload.language)}

    created = 0
    indexed = 0
    cached = 0
    movie_client = _http_client(settings.movie_service_url)
    search_client = _http_client(settings.search_service_url)

    for page in range(1, payload.pages + 1):
        movies = client.fetch_popular_movies(page, payload.language, payload.region)
        for movie in movies:
            genre_names = [genre_lookup.get(genre_id) for genre_id in movie.get("genre_ids", [])]
            genre_names = [name for name in genre_names if name]
            movie_payload = {
                "tmdb_id": movie.get("id"),
                "title": movie.get("title") or movie.get("name"),
                "overview": movie.get("overview"),
                "genres": ", ".join(genre_names) if genre_names else None,
                "release_date": movie.get("release_date") or None,
                "rating": movie.get("vote_average"),
                "popularity": movie.get("popularity"),
            }
            response = movie_client.post("/movies/import", json=movie_payload)
            if response.status_code in (200, 201):
                created += 1
                movie_id = response.json().get("movie_id")
                if movie_id:
                    search_payload = {
                        "movie_id": movie_id,
                        "tmdb_id": movie_payload["tmdb_id"],
                        "title": movie_payload["title"],
                        "overview": movie_payload["overview"],
                        "genres": movie_payload["genres"],
                        "release_date": movie_payload["release_date"],
                        "rating": movie_payload["rating"],
                        "popularity": movie_payload["popularity"],
                    }
                    index_response = search_client.post("/index", json=search_payload)
                    if index_response.status_code == 200:
                        indexed += 1
                if payload.cache_trending:
                    redis_client.zadd(
                        "trending_movies",
                        {json.dumps(movie_payload): float(movie_payload["rating"] or 0)},
                    )
                    cached += 1
            else:
                logger.warning(
                    "movie_import_failed",
                    extra={"status": response.status_code, "body": response.text},
                )

    movie_client.close()
    search_client.close()

    request_counter.labels(endpoint="ingest_tmdb_movies").inc()
    request_latency.labels(endpoint="ingest_tmdb_movies").observe(time.time() - start)
    return {"status": "ok", "imported": created, "indexed": indexed, "cached": cached}


@app.post("/ingest/tmdb/genres")
def ingest_tmdb_genres(payload: TmdbIngestRequest):
    start = time.time()
    try:
        client = TmdbClient()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    genres = client.fetch_genres(payload.language)
    metadata_client = _http_client(settings.metadata_service_url)
    response = metadata_client.post("/genres", json=[{"genre_id": g["id"], "name": g["name"]} for g in genres])
    metadata_client.close()

    if response.status_code >= 300:
        raise HTTPException(status_code=502, detail="Metadata service failed to ingest genres")

    request_counter.labels(endpoint="ingest_tmdb_genres").inc()
    request_latency.labels(endpoint="ingest_tmdb_genres").observe(time.time() - start)
    return {"status": "ok", "imported": len(genres)}


@app.post("/ingest/tmdb/people")
def ingest_tmdb_people(payload: TmdbIngestRequest):
    start = time.time()
    try:
        client = TmdbClient()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    metadata_client = _http_client(settings.metadata_service_url)
    imported = 0

    for page in range(1, payload.pages + 1):
        people = client.fetch_people(page, payload.language)
        payload_people = []
        for person in people:
            payload_people.append(
                {
                    "person_id": person.get("id"),
                    "name": person.get("name"),
                    "biography": person.get("biography"),
                    "birthday": person.get("birthday"),
                    "deathday": person.get("deathday"),
                    "profile_path": person.get("profile_path"),
                    "known_for_department": person.get("known_for_department"),
                }
            )
        response = metadata_client.post("/people", json=payload_people)
        if response.status_code >= 300:
            metadata_client.close()
            raise HTTPException(status_code=502, detail="Metadata service failed to ingest people")
        imported += len(payload_people)

    metadata_client.close()

    request_counter.labels(endpoint="ingest_tmdb_people").inc()
    request_latency.labels(endpoint="ingest_tmdb_people").observe(time.time() - start)
    return {"status": "ok", "imported": imported}


@app.post("/seed/users")
def seed_users(payload: SeedUsersRequest, x_seed_token: str | None = Header(default=None)):
    start = time.time()
    _require_seed_token(x_seed_token)

    auth_client = _http_client(settings.auth_service_url)
    created = 0
    for _ in range(payload.count):
        username = faker.user_name()
        email = faker.email()
        response = auth_client.post(
            "/register",
            json={"username": username, "email": email, "password": payload.password},
        )
        if response.status_code in (200, 201):
            created += 1
    auth_client.close()

    request_counter.labels(endpoint="seed_users").inc()
    request_latency.labels(endpoint="seed_users").observe(time.time() - start)
    return {"status": "ok", "created": created}


@app.post("/seed/reviews")
def seed_reviews(payload: SeedReviewsRequest, x_seed_token: str | None = Header(default=None)):
    start = time.time()
    _require_seed_token(x_seed_token)

    review_client = _http_client(settings.review_service_url)
    movie_client = _http_client(settings.movie_service_url)

    movie_ids = payload.movie_ids or [
        movie.get("movie_id")
        for movie in movie_client.get("/movies", params={"limit": 200}).json()
    ]
    if not movie_ids:
        raise HTTPException(status_code=400, detail="No movies available for seeding")

    user_ids = payload.user_ids or [settings.crawler_system_user_id]

    created = 0
    for _ in range(payload.count):
        movie_id = random.choice(movie_ids)
        user_id = random.choice(user_ids)
        review_payload = {
            "user_id": user_id,
            "movie_id": movie_id,
            "rating": random.randint(payload.min_rating, payload.max_rating),
            "review_text": faker.paragraph(nb_sentences=3),
        }
        response = review_client.post("/reviews", json=review_payload)
        if response.status_code in (200, 201):
            created += 1

    review_client.close()
    movie_client.close()

    request_counter.labels(endpoint="seed_reviews").inc()
    request_latency.labels(endpoint="seed_reviews").observe(time.time() - start)
    return {"status": "ok", "created": created}


@app.post("/publish")
def publish_message(payload: PublishMessageRequest, x_seed_token: str | None = Header(default=None)):
    start = time.time()
    _require_seed_token(x_seed_token)

    queue = payload.queue or settings.rabbitmq_events_queue
    connection = pika.BlockingConnection(pika.URLParameters(settings.rabbitmq_url))
    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)
    channel.basic_publish(
        exchange="",
        routing_key=queue,
        body=payload.message.encode("utf-8"),
        properties=pika.BasicProperties(delivery_mode=2),
    )
    connection.close()

    request_counter.labels(endpoint="publish_message").inc()
    request_latency.labels(endpoint="publish_message").observe(time.time() - start)
    return {"status": "ok", "queue": queue}
