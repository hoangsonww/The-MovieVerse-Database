from __future__ import annotations

import logging
import time

from fastapi import Depends, FastAPI, Query, status
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.common.db import Base, maybe_create_schema, postgres_engine, session_factory
from movieverse_services.common.events import publish_notification
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.notification_service.models import Notification
from movieverse_services.notification_service.schemas import NotificationCreate, NotificationResponse
from movieverse_services.common.config import settings

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = postgres_engine()
SessionLocal = session_factory(engine)

app = FastAPI(title="MovieVerse Notification Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_notification_requests_total",
    "Total requests to notification service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_notification_request_latency_seconds",
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


@app.post("/notify", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def notify(payload: NotificationCreate, session: Session = Depends(get_session)):
    start = time.time()
    notification = Notification(user_id=payload.user_id, message=payload.message, status="queued")
    session.add(notification)
    session.commit()
    session.refresh(notification)

    publish_notification({"user_id": payload.user_id, "message": payload.message})

    request_counter.labels(endpoint="notify").inc()
    request_latency.labels(endpoint="notify").observe(time.time() - start)
    return NotificationResponse(
        notification_id=notification.notification_id,
        user_id=notification.user_id,
        message=notification.message,
        status=notification.status,
        created_at=notification.created_at,
    )


@app.get("/notifications", response_model=list[NotificationResponse])
def list_notifications(
    user_id: int,
    session: Session = Depends(get_session),
    limit: int = Query(50, ge=1, le=200),
):
    start = time.time()
    notifications = session.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(limit)
    ).scalars().all()

    request_counter.labels(endpoint="list_notifications").inc()
    request_latency.labels(endpoint="list_notifications").observe(time.time() - start)
    return [
        NotificationResponse(
            notification_id=item.notification_id,
            user_id=item.user_id,
            message=item.message,
            status=item.status,
            created_at=item.created_at,
        )
        for item in notifications
    ]
