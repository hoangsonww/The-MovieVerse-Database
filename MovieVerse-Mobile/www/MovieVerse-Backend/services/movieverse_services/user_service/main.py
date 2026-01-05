from __future__ import annotations

import logging
import time

from fastapi import Depends, FastAPI, Header, HTTPException, status
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.db import Base, maybe_create_schema, postgres_engine, session_factory
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from jose import JWTError

from movieverse_services.common.security import decode_token
from movieverse_services.user_service.models import UserProfile
from movieverse_services.user_service.schemas import ProfileCreate, ProfileResponse, ProfileUpdate

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = postgres_engine()
SessionLocal = session_factory(engine)

app = FastAPI(title="MovieVerse User Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_user_requests_total",
    "Total requests to user service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_user_request_latency_seconds",
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


def auth_user_id(authorization: str | None) -> int:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    try:
        payload = decode_token(token)
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/profiles", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(
    payload: ProfileCreate,
    session: Session = Depends(get_session),
    authorization: str | None = Header(default=None),
):
    _ = auth_user_id(authorization)
    start = time.time()

    existing = session.query(UserProfile).filter(UserProfile.user_id == payload.user_id).first()
    if existing:
        raise HTTPException(status_code=409, detail="Profile already exists")

    profile = UserProfile(
        user_id=payload.user_id,
        display_name=payload.display_name,
        bio=payload.bio,
        favorite_genres=payload.favorite_genres,
    )
    session.add(profile)
    session.commit()
    session.refresh(profile)

    request_counter.labels(endpoint="create_profile").inc()
    request_latency.labels(endpoint="create_profile").observe(time.time() - start)
    return ProfileResponse(
        user_id=profile.user_id,
        display_name=profile.display_name,
        bio=profile.bio,
        favorite_genres=profile.favorite_genres,
    )


@app.get("/profiles/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: int, session: Session = Depends(get_session)):
    start = time.time()
    profile = session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    request_counter.labels(endpoint="get_profile").inc()
    request_latency.labels(endpoint="get_profile").observe(time.time() - start)
    return ProfileResponse(
        user_id=profile.user_id,
        display_name=profile.display_name,
        bio=profile.bio,
        favorite_genres=profile.favorite_genres,
    )


@app.put("/profiles/{user_id}", response_model=ProfileResponse)
def update_profile(
    user_id: int,
    payload: ProfileUpdate,
    session: Session = Depends(get_session),
    authorization: str | None = Header(default=None),
):
    _ = auth_user_id(authorization)
    start = time.time()

    profile = session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if payload.display_name is not None:
        profile.display_name = payload.display_name
    if payload.bio is not None:
        profile.bio = payload.bio
    if payload.favorite_genres is not None:
        profile.favorite_genres = payload.favorite_genres

    session.commit()
    session.refresh(profile)

    request_counter.labels(endpoint="update_profile").inc()
    request_latency.labels(endpoint="update_profile").observe(time.time() - start)
    return ProfileResponse(
        user_id=profile.user_id,
        display_name=profile.display_name,
        bio=profile.bio,
        favorite_genres=profile.favorite_genres,
    )
