from __future__ import annotations

import logging
import time

from fastapi import Depends, FastAPI, HTTPException, Query, status
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.db import Base, maybe_create_schema, postgres_engine, session_factory
from movieverse_services.common.events import publish_kafka_event, publish_notification
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.review_service.models import Review
from movieverse_services.review_service.schemas import ReviewCreate, ReviewResponse

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = postgres_engine()
SessionLocal = session_factory(engine)

app = FastAPI(title="MovieVerse Review Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_review_requests_total",
    "Total requests to review service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_review_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)


@app.on_event("startup")
def _startup() -> None:
    maybe_create_schema(engine)


@app.on_event("shutdown")
def _shutdown() -> None:
    engine.dispose()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreate, session: Session = Depends(get_session)):
    start = time.time()
    review = Review(
        user_id=payload.user_id,
        movie_id=payload.movie_id,
        rating=payload.rating,
        review_text=payload.review_text,
    )
    session.add(review)
    session.commit()
    session.refresh(review)

    publish_kafka_event(
        "review_created",
        {
            "review_id": review.review_id,
            "user_id": review.user_id,
            "movie_id": review.movie_id,
            "rating": review.rating,
        },
    )
    publish_notification(
        {
            "user_id": review.user_id,
            "message": "Thanks for submitting a review!",
            "movie_id": review.movie_id,
        }
    )

    request_counter.labels(endpoint="create_review").inc()
    request_latency.labels(endpoint="create_review").observe(time.time() - start)
    return ReviewResponse(
        review_id=review.review_id,
        user_id=review.user_id,
        movie_id=review.movie_id,
        rating=review.rating,
        review_text=review.review_text,
        created_at=review.created_at,
    )


@app.get("/reviews/movies/{movie_id}", response_model=list[ReviewResponse])
def list_reviews(movie_id: int, session: Session = Depends(get_session), limit: int = Query(50, ge=1, le=200)):
    start = time.time()
    reviews = session.execute(
        select(Review).where(Review.movie_id == movie_id).order_by(Review.created_at.desc()).limit(limit)
    ).scalars().all()

    request_counter.labels(endpoint="list_reviews").inc()
    request_latency.labels(endpoint="list_reviews").observe(time.time() - start)
    return [
        ReviewResponse(
            review_id=review.review_id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            rating=review.rating,
            review_text=review.review_text,
            created_at=review.created_at,
        )
        for review in reviews
    ]


@app.get("/reviews/users/{user_id}", response_model=list[ReviewResponse])
def list_user_reviews(user_id: int, session: Session = Depends(get_session), limit: int = Query(50, ge=1, le=200)):
    start = time.time()
    reviews = session.execute(
        select(Review).where(Review.user_id == user_id).order_by(Review.created_at.desc()).limit(limit)
    ).scalars().all()

    request_counter.labels(endpoint="list_user_reviews").inc()
    request_latency.labels(endpoint="list_user_reviews").observe(time.time() - start)
    return [
        ReviewResponse(
            review_id=review.review_id,
            user_id=review.user_id,
            movie_id=review.movie_id,
            rating=review.rating,
            review_text=review.review_text,
            created_at=review.created_at,
        )
        for review in reviews
    ]
