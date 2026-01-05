from __future__ import annotations

import logging
from datetime import datetime

import pandas as pd
from sqlalchemy import text

from movieverse_ai.config import settings
from movieverse_ai.data.sources import get_postgres_engine, load_movies, load_ratings
from movieverse_ai.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def build() -> None:
    ratings_df = load_ratings()
    movies_df = load_movies()

    user_stats = (
        ratings_df.groupby("user_id")["rating"]
        .agg(["mean", "count"])
        .reset_index()
        .rename(columns={"mean": "avg_rating", "count": "rating_count"})
    )

    recent_views_query = (
        "SELECT user_id, COUNT(*) AS recently_viewed_count "
        "FROM user_events WHERE event_time >= NOW() - INTERVAL '30 days' "
        "GROUP BY user_id"
    )
    with get_postgres_engine().connect() as conn:
        recent_views = pd.read_sql(text(recent_views_query), conn)

    user_features = (
        user_stats.merge(recent_views, on="user_id", how="left")
        .fillna({"recently_viewed_count": 0})
    )
    user_features["event_time"] = datetime.utcnow()

    rating_stats = (
        ratings_df.groupby("movie_id")["rating"]
        .agg(["mean", "count"])
        .reset_index()
        .rename(columns={"mean": "avg_rating", "count": "rating_count"})
    )

    event_counts_query = "SELECT movie_id, COUNT(*) AS popularity FROM user_events GROUP BY movie_id"
    with get_postgres_engine().connect() as conn:
        event_counts = pd.read_sql(text(event_counts_query), conn)

    movies_df = movies_df.copy()
    movies_df["release_year"] = pd.to_datetime(movies_df["release_date"], errors="coerce").dt.year.fillna(1900)

    movie_features = (
        movies_df[["movie_id", "release_year"]]
        .merge(rating_stats, on="movie_id", how="left")
        .merge(event_counts, on="movie_id", how="left")
        .fillna({"avg_rating": 0.0, "rating_count": 0, "popularity": 0})
    )
    movie_features["event_time"] = datetime.utcnow()

    upsert_user = text(
        """
        INSERT INTO user_features (user_id, rating_count, avg_rating, recently_viewed_count, event_time)
        VALUES (:user_id, :rating_count, :avg_rating, :recently_viewed_count, :event_time)
        ON CONFLICT (user_id) DO UPDATE SET
            rating_count = EXCLUDED.rating_count,
            avg_rating = EXCLUDED.avg_rating,
            recently_viewed_count = EXCLUDED.recently_viewed_count,
            event_time = EXCLUDED.event_time
        """
    )

    upsert_movie = text(
        """
        INSERT INTO movie_features (movie_id, rating_count, avg_rating, popularity, release_year, event_time)
        VALUES (:movie_id, :rating_count, :avg_rating, :popularity, :release_year, :event_time)
        ON CONFLICT (movie_id) DO UPDATE SET
            rating_count = EXCLUDED.rating_count,
            avg_rating = EXCLUDED.avg_rating,
            popularity = EXCLUDED.popularity,
            release_year = EXCLUDED.release_year,
            event_time = EXCLUDED.event_time
        """
    )

    with get_postgres_engine().begin() as conn:
        conn.execute(upsert_user, user_features.to_dict(orient="records"))
        conn.execute(upsert_movie, movie_features.to_dict(orient="records"))

    logger.info("feature_tables_built", extra={"users": len(user_features), "movies": len(movie_features)})


if __name__ == "__main__":
    build()
