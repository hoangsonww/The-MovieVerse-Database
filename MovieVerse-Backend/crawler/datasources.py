from __future__ import annotations

import logging

import httpx

from crawler.config import settings
from crawler.models import CrawlJob

logger = logging.getLogger(__name__)

DEFAULT_TMDB_IDS = [550, 278, 238, 240, 424]


def seed_jobs(limit: int = 20) -> list[CrawlJob]:
    if settings.tmdb_api_key:
        try:
            with httpx.Client(timeout=settings.crawler_timeout_seconds) as client:
                response = client.get(
                    f"{settings.tmdb_base_url}/movie/top_rated",
                    params={"api_key": settings.tmdb_api_key, "page": 1},
                )
                response.raise_for_status()
                items = response.json().get("results", [])[:limit]
                return [
                    CrawlJob(
                        url=f"tmdb:{item['id']}",
                        source="tmdb",
                        tags=["seed", "tmdb-top-rated"],
                        priority=1,
                    )
                    for item in items
                    if item.get("id")
                ]
        except Exception as exc:
            logger.warning("tmdb_seed_failed", extra={"error": str(exc)})

    if not settings.tmdb_api_key:
        logger.warning("tmdb_seed_skipped_no_api_key")
        return []

    return [
        CrawlJob(url=f"tmdb:{movie_id}", source="tmdb", tags=["seed", "tmdb-default"], priority=1)
        for movie_id in DEFAULT_TMDB_IDS
    ]
