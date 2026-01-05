from __future__ import annotations

import logging
import time

import redis
from fastapi import Depends, FastAPI, HTTPException, status
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.auth_service.models import User
from movieverse_services.auth_service.schemas import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
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
from movieverse_services.common.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = postgres_engine()
SessionLocal = session_factory(engine)
redis_client = redis.Redis.from_url(settings.redis_url, decode_responses=True)

app = FastAPI(title="MovieVerse Auth Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_auth_requests_total",
    "Total requests to auth service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_auth_request_latency_seconds",
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


@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, session: Session = Depends(get_session)):
    start = time.time()
    existing = session.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    request_counter.labels(endpoint="register").inc()
    request_latency.labels(endpoint="register").observe(time.time() - start)
    return UserResponse(id=user.id, email=user.email, username=user.username)


@app.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    start = time.time()
    user = session.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))
    redis_client.setex(f"refresh:{user.id}", settings.refresh_exp_hours * 3600, refresh_token)

    request_counter.labels(endpoint="login").inc()
    request_latency.labels(endpoint="login").observe(time.time() - start)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@app.post("/refresh", response_model=TokenResponse)
def refresh_token(payload: RefreshRequest):
    stored = redis_client.get(f"refresh:{payload.user_id}")
    if not stored or stored != payload.refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token = create_access_token(str(payload.user_id))
    new_refresh = create_refresh_token(str(payload.user_id))
    redis_client.setex(f"refresh:{payload.user_id}", settings.refresh_exp_hours * 3600, new_refresh)
    return TokenResponse(access_token=access_token, refresh_token=new_refresh)
