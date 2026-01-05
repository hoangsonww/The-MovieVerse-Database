from __future__ import annotations

import logging
import time

import redis
from django.conf import settings as django_settings
from django.http import HttpResponse, HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin

from movieverse_middleware.config import settings
from movieverse_middleware.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


class RequestTimingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        duration_ms = (time.time() - request.start_time) * 1000
        logger.info("django_request_completed", extra={"path": request.path, "duration_ms": duration_ms})
        return response


class URLBasedRateLimitingMiddleware(MiddlewareMixin):
    def __init__(self, get_response=None):
        super().__init__(get_response)
        self.redis = redis.Redis.from_url(settings.redis_url, decode_responses=True)

    def process_request(self, request):
        client_ip = request.META.get("REMOTE_ADDR", "unknown")
        key = f"ratelimit:{client_ip}:{request.path}"
        count = self.redis.incr(key)
        if count == 1:
            self.redis.expire(key, settings.rate_limit_window_sec)
        if count > settings.rate_limit_max:
            return HttpResponse("Rate limit exceeded", status=429)


class ContentSecurityPolicyMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["Content-Security-Policy"] = (
            f"default-src {settings.csp_default_src}; "
            f"img-src {settings.csp_img_src}; "
            f"script-src {settings.csp_script_src}"
        )
        response["X-Content-Type-Options"] = "nosniff"
        response["X-Frame-Options"] = "DENY"
        response["Referrer-Policy"] = "no-referrer"
        return response


class ExceptionLoggingDjangoMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.exception("django_exception", extra={"path": request.path, "error": str(exception)})


class BlacklistingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        blacklisted_ips = getattr(django_settings, "BLACKLISTED_IPS", [])
        ip_address = request.META.get("REMOTE_ADDR")
        if ip_address in blacklisted_ips:
            return HttpResponseForbidden("Access denied.")
