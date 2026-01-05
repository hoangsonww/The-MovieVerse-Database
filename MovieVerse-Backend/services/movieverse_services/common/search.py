from __future__ import annotations

from opensearchpy import OpenSearch

from movieverse_services.common.config import settings


def client() -> OpenSearch:
    return OpenSearch(hosts=[settings.opensearch_url])


def ensure_movie_index() -> None:
    opensearch = client()
    if opensearch.indices.exists(settings.opensearch_index):
        return
    opensearch.indices.create(
        index=settings.opensearch_index,
        body={
            "mappings": {
                "properties": {
                    "movie_id": {"type": "integer"},
                    "tmdb_id": {"type": "integer"},
                    "title": {"type": "text"},
                    "overview": {"type": "text"},
                    "genres": {"type": "keyword"},
                    "release_date": {"type": "date", "format": "yyyy-MM-dd||epoch_millis"},
                    "rating": {"type": "float"},
                    "popularity": {"type": "float"},
                }
            }
        },
    )


def ensure_review_index() -> None:
    opensearch = client()
    if opensearch.indices.exists(settings.opensearch_reviews_index):
        return
    opensearch.indices.create(
        index=settings.opensearch_reviews_index,
        body={
            "mappings": {
                "properties": {
                    "review_id": {"type": "integer"},
                    "movie_id": {"type": "integer"},
                    "user_id": {"type": "integer"},
                    "review_text": {"type": "text"},
                    "rating": {"type": "float"},
                    "created_at": {"type": "date", "format": "yyyy-MM-dd||epoch_millis"},
                }
            }
        },
    )


def index_movie(movie: dict) -> None:
    opensearch = client()
    ensure_movie_index()
    opensearch.index(index=settings.opensearch_index, id=movie["movie_id"], body=movie, refresh=True)


def index_review(review: dict) -> None:
    opensearch = client()
    ensure_review_index()
    opensearch.index(
        index=settings.opensearch_reviews_index,
        id=review["review_id"],
        body=review,
        refresh=True,
    )


def search_movies(query: str, limit: int = 10) -> list[dict]:
    opensearch = client()
    ensure_movie_index()
    response = opensearch.search(
        index=settings.opensearch_index,
        body={
            "size": limit,
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^3", "overview", "genres"],
                }
            },
        },
    )
    return [hit["_source"] for hit in response["hits"]["hits"]]


def search_reviews(query: str, limit: int = 10) -> list[dict]:
    opensearch = client()
    ensure_review_index()
    response = opensearch.search(
        index=settings.opensearch_reviews_index,
        body={
            "size": limit,
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["review_text"],
                }
            },
        },
    )
    return [hit["_source"] for hit in response["hits"]["hits"]]
