from __future__ import annotations

import logging
import time
import uuid

import redis
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware as StarletteCORSMiddleware
from starlette.requests import Request
from starlette.responses import Response

from movieverse_middleware.config import settings
from movieverse_middleware.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start = time.time()
        response = await call_next(request)
        duration_ms = (time.time() - start) * 1000
        response.headers["X-Request-ID"] = request_id
        logger.info(
            "request_completed",
            extra={
                "path": request.url.path,
                "method": request.method,
                "status_code": response.status_code,
                "duration_ms": round(duration_ms, 2),
                "request_id": request_id,
            },
        )
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis = redis.Redis.from_url(settings.redis_url, decode_responses=True)

    async def dispatch(self, request: Request, call_next) -> Response:
        client_ip = request.headers.get("X-Forwarded-For", request.client.host)
        if client_ip and "," in client_ip:
            client_ip = client_ip.split(",")[0].strip()
        key = f"ratelimit:{client_ip}:{request.url.path}"
        try:
            count = self.redis.incr(key)
            if count == 1:
                self.redis.expire(key, settings.rate_limit_window_sec)
            if count > settings.rate_limit_max:
                return Response("Rate limit exceeded", status_code=429)
        except redis.RedisError as exc:
            logger.warning("rate_limit_unavailable", extra={"error": str(exc)})
        return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = (
            f"default-src {settings.csp_default_src}; "
            f"img-src {settings.csp_img_src}; "
            f"script-src {settings.csp_script_src}"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response


class ExceptionLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        try:
            return await call_next(request)
        except Exception:
            logger.exception("request_failed", extra={"path": request.url.path})
            raise


class CORSMiddleware(StarletteCORSMiddleware):
    def __init__(self, app):
        super().__init__(
            app,
            allow_origins=[origin.strip() for origin in settings.cors_allow_origins.split(",") if origin.strip()]
            or ["*"],
            allow_methods=[method.strip() for method in settings.cors_allow_methods.split(",")],
            allow_headers=[header.strip() for header in settings.cors_allow_headers.split(",")],
        )
