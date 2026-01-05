from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str


class RecommendationRequest(BaseModel):
    user_id: int
    limit: int = Field(default=10, ge=1, le=100)
    filter_genres: Optional[List[str]] = None


class RecommendationItem(BaseModel):
    movie_id: int
    score: float


class RecommendationResponse(BaseModel):
    user_id: int
    items: List[RecommendationItem]


class SimilarMoviesRequest(BaseModel):
    movie_id: int
    limit: int = Field(default=10, ge=1, le=100)


class SimilarMoviesResponse(BaseModel):
    movie_id: int
    items: List[RecommendationItem]


class SentimentRequest(BaseModel):
    text: str


class SentimentResponse(BaseModel):
    label: str
    score: float


class RankItem(BaseModel):
    movie_id: int
    features: dict


class RankRequest(BaseModel):
    user_id: Optional[int] = None
    items: List[RankItem]


class RankResponse(BaseModel):
    ranked_items: List[RecommendationItem]


class SummarizeRequest(BaseModel):
    text: str
    max_length: Optional[int] = Field(default=None, ge=30, le=512)
    min_length: Optional[int] = Field(default=None, ge=10, le=200)
    style: str = Field(default="default")


class SummarizeResponse(BaseModel):
    summary: str


class GenreClassifyRequest(BaseModel):
    text: str
    top_k: int = Field(default=3, ge=1, le=10)


class GenreClassifyResponse(BaseModel):
    predictions: List[dict]


class VisionLabelsRequest(BaseModel):
    image_url: str
    max_labels: int = Field(default=5, ge=1, le=20)


class VisionLabelsResponse(BaseModel):
    labels: List[str]
