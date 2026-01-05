from __future__ import annotations

import logging
import time
from urllib.parse import urlparse

import httpx

from crawler.config import settings
from crawler.exceptions import DataFetchError

logger = logging.getLogger(__name__)


class HttpFetcher:
    def __init__(self) -> None:
        self.allowed_domains = [
            domain.strip() for domain in settings.crawler_allowed_domains.split(",") if domain.strip()
        ]

    def _allowed(self, url: str) -> bool:
        if not self.allowed_domains:
            return True
        hostname = urlparse(url).hostname or ""
        return any(hostname.endswith(domain) for domain in self.allowed_domains)

    def fetch(self, url: str) -> str:
        if not self._allowed(url):
            raise DataFetchError(f"Domain not allowed: {url}")

        headers = {"User-Agent": settings.crawler_user_agent}
        last_error: Exception | None = None
        for attempt in range(settings.crawler_max_retries + 1):
            try:
                with httpx.Client(
                    timeout=settings.crawler_timeout_seconds,
                    follow_redirects=True,
                    verify=settings.crawler_verify_tls,
                ) as client:
                    response = client.get(url, headers=headers)
                    if response.status_code >= 400:
                        raise DataFetchError(f"HTTP {response.status_code} for {url}")
                    if len(response.content) > settings.crawler_max_content_bytes:
                        raise DataFetchError(f"Payload too large for {url}")
                    return response.text
            except Exception as exc:
                last_error = exc
                logger.warning("fetch_attempt_failed", extra={"url": url, "attempt": attempt, "error": str(exc)})
                time.sleep(settings.crawler_retry_backoff_seconds * (attempt + 1))

        raise DataFetchError(str(last_error) if last_error else "Unknown fetch error")


def fetch_movie_data(url: str) -> str | None:
    return HttpFetcher().fetch(url)
