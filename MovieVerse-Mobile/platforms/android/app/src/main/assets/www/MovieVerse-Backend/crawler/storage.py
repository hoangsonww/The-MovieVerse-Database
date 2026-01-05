from __future__ import annotations

import logging
from datetime import datetime

import httpx

from crawler.config import settings
from crawler.exceptions import DataSaveError
from crawler.models import CrawlAnalysis, MoviePayload

logger = logging.getLogger(__name__)


def _parse_date(value: str | None) -> str | None:
    if not value:
        return None
    for fmt in ("%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            continue
    try:
        return datetime.fromisoformat(value).date().isoformat()
    except ValueError:
        return None


def _to_float(value) -> float | None:
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def _to_int(value) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None


def _normalize_movie(movie_data: dict) -> MoviePayload:
    return MoviePayload(
        title=movie_data.get("name") or "",
        overview=movie_data.get("description"),
        genres=movie_data.get("genres") or [],
        release_date=_parse_date(movie_data.get("release_date")),
        rating=_to_float(movie_data.get("rating") or movie_data.get("imdb_rating")),
        popularity=_to_float(movie_data.get("popularity")),
        poster_url=movie_data.get("poster_url"),
        tmdb_id=_to_int(movie_data.get("tmdb_id")),
        imdb_id=movie_data.get("id") or movie_data.get("imdb_id"),
    )


def store_movie_bundle(movie_data: dict, analysis: dict | None) -> dict:
    movie = _normalize_movie(movie_data)
    movie_payload = {
        "tmdb_id": movie.tmdb_id,
        "title": movie.title,
        "overview": movie.overview,
        "genres": ", ".join(movie.genres) if movie.genres else None,
        "release_date": movie.release_date,
        "rating": movie.rating,
        "popularity": movie.popularity,
    }

    try:
        with httpx.Client(timeout=20.0) as client:
            response = client.post(f"{settings.movie_service_url}/movies/import", json=movie_payload)
            response.raise_for_status()
            movie_id = response.json().get("movie_id")

            if movie_id and movie_data.get("reviews"):
                for review in movie_data["reviews"]:
                    review_payload = {
                        "user_id": settings.crawler_system_user_id,
                        "movie_id": movie_id,
                        "rating": _to_float(review.get("rating")) or 0.0,
                        "review_text": review.get("content") or "Auto-generated review.",
                    }
                    client.post(f"{settings.review_service_url}/reviews", json=review_payload)

            if movie_id and analysis:
                analysis_payload = CrawlAnalysis(**analysis)
                extra = {
                    "source_url": movie_data.get("source_url"),
                    "source": analysis_payload.source,
                    "tags": analysis_payload.tags,
                    "poster_url": movie.poster_url,
                    "imdb_id": movie.imdb_id,
                    "tmdb_id": movie.tmdb_id,
                    "cast": movie_data.get("cast"),
                    "director": movie_data.get("director"),
                    "writers": movie_data.get("writers"),
                    "company": movie_data.get("company"),
                    "country": movie_data.get("country"),
                    "language": movie_data.get("language"),
                    "tagline": movie_data.get("tagline"),
                    "awards": movie_data.get("awards"),
                    "box_office": movie_data.get("box_office"),
                    "budget": movie_data.get("budget"),
                    "website": movie_data.get("website"),
                }
                genre_predictions = None
                if analysis_payload.extra:
                    genre_predictions = analysis_payload.extra.get("genre_predictions")
                    for key, value in analysis_payload.extra.items():
                        if key != "genre_predictions":
                            extra[key] = value
                client.post(
                    f"{settings.metadata_service_url}/movies/{movie_id}/analysis",
                    json={
                        "sentiment": analysis_payload.sentiment,
                        "summary": analysis_payload.summary,
                        "image_labels": analysis_payload.image_labels,
                        "genre_predictions": genre_predictions,
                        "extra": extra,
                    },
                )

            if movie_id:
                search_payload = {
                    "movie_id": movie_id,
                    "title": movie.title,
                    "overview": movie.overview,
                    "genres": movie_payload["genres"],
                    "release_date": movie.release_date,
                    "rating": movie.rating,
                    "popularity": movie.popularity,
                }
                try:
                    client.post(f"{settings.search_service_url}/index", json=search_payload)
                except Exception as exc:
                    logger.warning("search_index_failed", extra={"error": str(exc)})

            return {"status": "ok", "movie_id": movie_id}
    except Exception as exc:
        logger.exception("store_movie_bundle_failed", extra={"error": str(exc)})
        raise DataSaveError(str(exc)) from exc
