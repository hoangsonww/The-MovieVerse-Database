from __future__ import annotations

import pandas as pd
from pymongo import MongoClient
from sqlalchemy import create_engine, text

from movieverse_ai.config import settings


def get_postgres_engine():
    return create_engine(settings.postgres_dsn, pool_pre_ping=True)


def get_mysql_engine():
    return create_engine(settings.mysql_dsn, pool_pre_ping=True)


def get_mongo_client():
    return MongoClient(settings.mongo_uri)


def load_ratings(limit: int | None = None) -> pd.DataFrame:
    query = "SELECT user_id, movie_id, rating, created_at FROM ratings"
    if limit:
        query += " LIMIT :limit"
    with get_postgres_engine().connect() as conn:
        return pd.read_sql(text(query), conn, params={"limit": limit} if limit else None)


def load_reviews(limit: int | None = None) -> pd.DataFrame:
    query = "SELECT review_id, user_id, movie_id, rating, review_text, created_at FROM reviews"
    if limit:
        query += " LIMIT :limit"
    with get_postgres_engine().connect() as conn:
        return pd.read_sql(text(query), conn, params={"limit": limit} if limit else None)


def load_movies(limit: int | None = None) -> pd.DataFrame:
    query = "SELECT movie_id, title, overview, genres, release_date FROM movies"
    if limit:
        query += " LIMIT :limit"
    with get_mysql_engine().connect() as conn:
        return pd.read_sql(text(query), conn, params={"limit": limit} if limit else None)


def load_ranking_features(limit: int | None = None) -> pd.DataFrame:
    query = (
        "SELECT movie_id, popularity, avg_rating, rating_count, recency_days, label "
        "FROM ranking_features"
    )
    if limit:
        query += " LIMIT :limit"
    with get_postgres_engine().connect() as conn:
        return pd.read_sql(text(query), conn, params={"limit": limit} if limit else None)
