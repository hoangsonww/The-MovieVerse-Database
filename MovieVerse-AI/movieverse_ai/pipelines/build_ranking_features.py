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

    rating_stats = (
        ratings_df.groupby("movie_id")["rating"]
        .agg(["mean", "count"])
        .reset_index()
        .rename(columns={"mean": "avg_rating", "count": "rating_count"})
    )

    movies_df = movies_df.copy()
    movies_df["release_year"] = pd.to_datetime(movies_df["release_date"], errors="coerce").dt.year
    movies_df["recency_days"] = (
        datetime.utcnow() - pd.to_datetime(movies_df["release_date"], errors="coerce")
    ).dt.days.fillna(3650)

    event_counts_query = "SELECT movie_id, COUNT(*) AS popularity FROM user_events GROUP BY movie_id"
    with get_postgres_engine().connect() as conn:
        event_counts = pd.read_sql(text(event_counts_query), conn)

    features = (
        movies_df[["movie_id", "release_year", "recency_days"]]
        .merge(rating_stats, on="movie_id", how="left")
        .merge(event_counts, on="movie_id", how="left")
        .fillna({"avg_rating": 0.0, "rating_count": 0, "popularity": 0})
    )

    features["label"] = (
        features["avg_rating"] * 0.6
        + features["rating_count"] * 0.01
        + features["popularity"] * 0.01
        - features["recency_days"] * 0.0001
    )

    upsert = text(
        """
        INSERT INTO ranking_features (movie_id, popularity, avg_rating, rating_count, recency_days, label)
        VALUES (:movie_id, :popularity, :avg_rating, :rating_count, :recency_days, :label)
        ON CONFLICT (movie_id) DO UPDATE SET
            popularity = EXCLUDED.popularity,
            avg_rating = EXCLUDED.avg_rating,
            rating_count = EXCLUDED.rating_count,
            recency_days = EXCLUDED.recency_days,
            label = EXCLUDED.label
        """
    )

    with get_postgres_engine().begin() as conn:
        conn.execute(upsert, features.to_dict(orient="records"))

    logger.info("ranking_features_built", extra={"rows": len(features)})


if __name__ == "__main__":
    build()
