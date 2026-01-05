from __future__ import annotations

import json
import logging

from kafka import KafkaConsumer
from movieverse_services.common.config import settings
from movieverse_services.common.db import mysql_engine, postgres_engine, session_factory
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.search import index_movie, index_review
from movieverse_services.movie_service.models import Movie
from movieverse_services.review_service.models import Review

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

mysql_session = session_factory(mysql_engine())
postgres_session = session_factory(postgres_engine())


def _index_movie(movie_id: int) -> None:
    session = mysql_session()
    try:
        movie = session.get(Movie, movie_id)
        if not movie:
            logger.warning("movie_not_found_for_index", extra={"movie_id": movie_id})
            return
        index_movie(
            {
                "movie_id": movie.movie_id,
                "tmdb_id": movie.tmdb_id,
                "title": movie.title,
                "overview": movie.overview,
                "genres": movie.genres,
                "release_date": movie.release_date.isoformat() if movie.release_date else None,
                "rating": movie.rating,
                "popularity": movie.popularity,
            }
        )
    finally:
        session.close()


def _index_review(review_id: int) -> None:
    session = postgres_session()
    try:
        review = session.get(Review, review_id)
        if not review:
            logger.warning("review_not_found_for_index", extra={"review_id": review_id})
            return
        index_review(
            {
                "review_id": review.review_id,
                "movie_id": review.movie_id,
                "user_id": review.user_id,
                "review_text": review.review_text,
                "rating": float(review.rating),
                "created_at": review.created_at.isoformat(),
            }
        )
    finally:
        session.close()


def main() -> None:
    consumer = KafkaConsumer(
        settings.kafka_events_topic,
        bootstrap_servers=settings.kafka_bootstrap_servers,
        group_id="movieverse-search-indexer",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest",
        enable_auto_commit=True,
    )

    logger.info("search_indexer_consumer_started")
    for message in consumer:
        event = message.value
        try:
            event_type = event.get("type")
            if event_type in ("movie_created", "movie_updated"):
                movie_id = event.get("movie_id")
                if movie_id is None:
                    logger.warning("movie_event_missing_id", extra={"event": event})
                    continue
                _index_movie(int(movie_id))
            elif event_type == "review_created":
                review_id = event.get("review_id")
                if review_id is None:
                    logger.warning("review_event_missing_id", extra={"event": event})
                    continue
                _index_review(int(review_id))
            else:
                logger.debug("event_skipped", extra={"event_type": event_type})
        except Exception as exc:
            logger.exception("event_processing_failed", extra={"error": str(exc), "event": event})


if __name__ == "__main__":
    main()
