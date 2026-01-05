from __future__ import annotations

import logging

from crawler.ai.client import classify_genre, classify_image, summarize_text
from crawler.ai.text_analysis import analyze_text_sentiment
from crawler.exceptions import DataFetchError, DataSaveError, ParsingError
from crawler.models import CrawlJob
from crawler.sources.registry import source_registry
from crawler.storage import store_movie_bundle
from crawler.validators import validate_movie_data

logger = logging.getLogger(__name__)


def orchestrate_crawling(
    url: str,
    source: str | None = None,
    tags: list[str] | None = None,
    job_id: str | None = None,
):
    job = CrawlJob(url=url, source=source, tags=tags or [], job_id=job_id)
    try:
        source_impl = source_registry.resolve(job)
        raw = source_impl.fetch(job)
        movie_data = source_impl.parse(raw)
        movie_data["source_url"] = url
        validate_movie_data(movie_data)

        summary = summarize_text(movie_data.get("description", ""), style="concise")
        sentiment_result = analyze_text_sentiment(movie_data.get("description", ""))
        image_labels = classify_image(movie_data.get("poster_url", "")) or []
        genre_predictions = classify_genre(movie_data.get("description", "")) or []

        analysis = {
            "sentiment": sentiment_result,
            "summary": summary,
            "image_labels": image_labels,
            "tags": tags or [],
            "source": source,
            "extra": {"genre_predictions": genre_predictions},
        }

        result = store_movie_bundle(movie_data, analysis)
        logger.info("crawl_completed", extra={"url": url, "job_id": job_id})
        return result

    except (ParsingError, DataFetchError, DataSaveError) as exc:
        logger.error("crawl_failed", extra={"url": url, "job_id": job_id, "error": str(exc)})
        raise
    except Exception as exc:
        logger.exception("crawl_unexpected_error", extra={"url": url, "job_id": job_id})
        raise DataSaveError(str(exc)) from exc
