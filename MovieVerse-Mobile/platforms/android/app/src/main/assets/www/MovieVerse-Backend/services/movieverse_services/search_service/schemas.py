from __future__ import annotations

from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=10, ge=1, le=100)


class IndexRequest(BaseModel):
    movie_id: int
    tmdb_id: int | None = None
    title: str
    overview: str | None = None
    genres: str | None = None
    release_date: str | None = None
    rating: float | None = None
    popularity: float | None = None


class ReviewIndexRequest(BaseModel):
    review_id: int
    movie_id: int
    user_id: int
    review_text: str
    rating: float | None = None
    created_at: str | None = None


class ReviewSearchRequest(BaseModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=10, ge=1, le=100)
