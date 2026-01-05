from __future__ import annotations

import json
import logging
import time

import httpx
import redis
from fastapi import Depends, FastAPI, HTTPException
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.db import mysql_engine, session_factory
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.movie_service.models import Movie
from movieverse_services.recommendation_service.schemas import (
    RecommendationRequest,
    RecommendationResponse,
    SimilarRequest,
    SimilarResponse,
)

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = mysql_engine()
SessionLocal = session_factory(engine)
redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)

app = FastAPI(title="MovieVerse Recommendation Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_reco_requests_total",
    "Total requests to recommendation service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_reco_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)


@app.on_event("shutdown")
def _shutdown() -> None:
    engine.dispose()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def fallback_popular(session: Session, limit: int) -> list[dict]:
    movies = session.execute(
        select(Movie).order_by(Movie.popularity.desc().nullslast()).limit(limit)
    ).scalars().all()
    return [{"movie_id": movie.movie_id, "score": movie.popularity or 0.0} for movie in movies]


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest, session: Session = Depends(get_session)):
    start = time.time()
    cache_key = f"reco:{payload.user_id}:{payload.limit}:{','.join(payload.filter_genres or [])}"
    cached = redis_client.get(cache_key)
    if cached:
        data = json.loads(cached)
    else:
        try:
            response = httpx.post(
                f"{settings.ai_service_url}/recommendations",
                json=payload.model_dump(),
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
        except Exception:
            data = {"user_id": payload.user_id, "items": fallback_popular(session, payload.limit)}
        redis_client.setex(cache_key, 300, json.dumps(data))

    request_counter.labels(endpoint="recommendations").inc()
    request_latency.labels(endpoint="recommendations").observe(time.time() - start)
    return RecommendationResponse(user_id=data["user_id"], items=data["items"])


@app.post("/similar", response_model=SimilarResponse)
def similar(payload: SimilarRequest, session: Session = Depends(get_session)):
    start = time.time()
    cache_key = f"similar:{payload.movie_id}:{payload.limit}"
    cached = redis_client.get(cache_key)
    if cached:
        data = json.loads(cached)
    else:
        try:
            response = httpx.post(
                f"{settings.ai_service_url}/similar",
                json=payload.model_dump(),
                timeout=10,
            )
            response.raise_for_status()
            data = response.json()
        except Exception:
            data = {"movie_id": payload.movie_id, "items": fallback_popular(session, payload.limit)}
        redis_client.setex(cache_key, 300, json.dumps(data))

    request_counter.labels(endpoint="similar").inc()
    request_latency.labels(endpoint="similar").observe(time.time() - start)
    return SimilarResponse(movie_id=data["movie_id"], items=data["items"])
