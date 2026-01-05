from __future__ import annotations

from typing import Iterable

from .client import DataPlatformClient


def healthcheck(client: DataPlatformClient) -> dict:
    return client.get("/healthz")


def ingest_tmdb(
    client: DataPlatformClient,
    pages: int,
    cache_trending: bool,
    language: str | None,
    region: str | None,
) -> dict:
    payload = {
        "pages": pages,
        "cache_trending": cache_trending,
        "language": language,
        "region": region,
    }
    movies = client.post("/ingest/tmdb/movies", payload)
    genres = client.post("/ingest/tmdb/genres", payload)
    people = client.post("/ingest/tmdb/people", payload)
    return {"movies": movies, "genres": genres, "people": people}


def seed_users(client: DataPlatformClient, count: int, password: str) -> dict:
    return client.post("/seed/users", {"count": count, "password": password}, require_seed=True)


def seed_reviews(
    client: DataPlatformClient,
    count: int,
    min_rating: int,
    max_rating: int,
    user_ids: Iterable[int] | None,
    movie_ids: Iterable[int] | None,
) -> dict:
    payload: dict = {"count": count, "min_rating": min_rating, "max_rating": max_rating}
    if user_ids:
        payload["user_ids"] = list(user_ids)
    if movie_ids:
        payload["movie_ids"] = list(movie_ids)
    return client.post("/seed/reviews", payload, require_seed=True)


def publish_message(client: DataPlatformClient, message: str, queue: str | None) -> dict:
    payload = {"message": message}
    if queue:
        payload["queue"] = queue
    return client.post("/publish", payload, require_seed=True)
