from __future__ import annotations

from typing import Iterable, Tuple

from movieverse_middleware.config import settings


class CorsMiddleware:
    def __init__(self, app):
        self.app = app
        self.allow_origins = settings.cors_allow_origins
        self.allow_methods = settings.cors_allow_methods
        self.allow_headers = settings.cors_allow_headers

    def __call__(self, environ, start_response):
        def cors_headers(status: str, headers: Iterable[Tuple[str, str]]):
            headers = list(headers)
            headers.extend(
                [
                    ("Access-Control-Allow-Origin", self.allow_origins),
                    ("Access-Control-Allow-Methods", self.allow_methods),
                    ("Access-Control-Allow-Headers", self.allow_headers),
                ]
            )
            return start_response(status, headers)

        if environ.get("REQUEST_METHOD") == "OPTIONS":
            return cors_headers("200 OK", [])

        def modified_start_response(status, headers, exc_info=None):
            return cors_headers(status, headers)

        return self.app(environ, modified_start_response)


def wrap_wsgi_app(app):
    return CorsMiddleware(app)
