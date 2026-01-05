from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class TmdbIngestRequest(BaseModel):
    pages: int = Field(default=1, ge=1, le=50)
    language: Optional[str] = None
    region: Optional[str] = None
    cache_trending: bool = True


class SeedUsersRequest(BaseModel):
    count: int = Field(default=50, ge=1, le=5000)
    password: str = Field(min_length=8)


class SeedReviewsRequest(BaseModel):
    count: int = Field(default=100, ge=1, le=10000)
    min_rating: int = Field(default=1, ge=1, le=10)
    max_rating: int = Field(default=5, ge=1, le=10)
    user_ids: Optional[List[int]] = None
    movie_ids: Optional[List[int]] = None


class PublishMessageRequest(BaseModel):
    message: str
    queue: Optional[str] = None
