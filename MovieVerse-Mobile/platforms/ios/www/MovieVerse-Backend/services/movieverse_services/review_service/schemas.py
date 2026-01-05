from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    user_id: int
    movie_id: int
    rating: float = Field(ge=0, le=10)
    review_text: str = Field(min_length=1, max_length=2000)


class ReviewResponse(BaseModel):
    review_id: int
    user_id: int
    movie_id: int
    rating: float
    review_text: str
    created_at: datetime
