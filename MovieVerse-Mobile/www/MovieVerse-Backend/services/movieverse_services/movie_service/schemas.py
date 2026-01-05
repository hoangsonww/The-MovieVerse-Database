from __future__ import annotations

from datetime import date
from pydantic import BaseModel, Field


class MovieCreate(BaseModel):
    tmdb_id: int | None = None
    title: str = Field(min_length=1, max_length=255)
    overview: str | None = Field(default=None, max_length=2000)
    genres: str | None = Field(default=None, max_length=255)
    release_date: date | None = None
    rating: float | None = Field(default=None, ge=0, le=10)
    popularity: float | None = Field(default=None, ge=0)


class MovieUpdate(BaseModel):
    tmdb_id: int | None = None
    title: str | None = Field(default=None, max_length=255)
    overview: str | None = Field(default=None, max_length=2000)
    genres: str | None = Field(default=None, max_length=255)
    release_date: date | None = None
    rating: float | None = Field(default=None, ge=0, le=10)
    popularity: float | None = Field(default=None, ge=0)


class MovieResponse(BaseModel):
    movie_id: int
    tmdb_id: int | None = None
    title: str
    overview: str | None
    genres: str | None
    release_date: date | None
    rating: float | None
    popularity: float | None
