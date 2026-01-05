from __future__ import annotations

import logging

from crawler.crawler_orchestrator import orchestrate_crawling

logger = logging.getLogger(__name__)


def crawl_movie_data_and_store(
    url: str,
    source: str | None = None,
    tags: list[str] | None = None,
    job_id: str | None = None,
):
    logger.info("crawl_started", extra={"url": url, "source": source, "job_id": job_id})
    return orchestrate_crawling(url, source=source, tags=tags, job_id=job_id)
