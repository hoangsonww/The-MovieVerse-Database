from __future__ import annotations

from pydantic import BaseModel, Field


class RecommendationResponse(BaseModel):
    user_id: int
    items: list[dict]


class SimilarResponse(BaseModel):
    movie_id: int
    items: list[dict]


class RecommendationRequest(BaseModel):
    user_id: int
    limit: int = Field(default=10, ge=1, le=100)
    filter_genres: list[str] | None = None


class SimilarRequest(BaseModel):
    movie_id: int
    limit: int = Field(default=10, ge=1, le=100)
