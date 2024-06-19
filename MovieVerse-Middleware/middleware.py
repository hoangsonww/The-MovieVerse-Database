import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache
from django.conf import settings
from django.urls import resolve
from django.http import HttpResponse, HttpResponseForbidden

logger = logging.getLogger(__name__)


class RequestTimingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()

    def process_response(self, request, response):
        end_time = time.time()
        duration = (end_time - request.start_time) * 1000  # Duration in milliseconds
        logger.info(f"Request '{request.path}' took {duration:.2f}ms")
        return response


class URLBasedRateLimitingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        view_func = resolve(request.path_info).func  # Get the view function
        rate_limit_config = getattr(view_func, 'rate_limit', None)

        if rate_limit_config:
            key = f'ratelimit:{request.META["REMOTE_ADDR"]}:{view_func.__name__}'
            requests = cache.get(key, 0)
            if requests >= rate_limit_config['max_requests']:
                return HttpResponse("Rate limit exceeded", status=429)
            cache.incr(key)
            cache.expire(key, rate_limit_config['window'])


class ContentSecurityPolicyMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        csp = {
            "default-src": "'self'",
            "img-src": ["'self'", "data:", "https://image.tmdb.org"],
            "script-src": ["'self'", "https://code.jquery.com"],
            # ... other CSP directives
        }
        response["Content-Security-Policy"] = "; ".join(
            [f"{k} {' '.join(v)}" for k, v in csp.items()]
        )
        return response


class ExceptionLoggingMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.exception(f"Exception occurred for request '{request.path}': {exception}")


class BlacklistingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Get the list of blacklisted IPs from the settings
        blacklisted_ips = getattr(settings, "BLACKLISTED_IPS", [])
        ip_address = request.META.get('REMOTE_ADDR')
        if ip_address in blacklisted_ips:
            return HttpResponseForbidden("Access denied.")
