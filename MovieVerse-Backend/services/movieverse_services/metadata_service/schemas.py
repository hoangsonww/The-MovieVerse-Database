from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class GenrePayload(BaseModel):
    genre_id: int = Field(ge=0)
    name: str


class PersonPayload(BaseModel):
    person_id: int = Field(ge=0)
    name: str
    biography: Optional[str] = None
    birthday: Optional[str] = None
    deathday: Optional[str] = None
    profile_path: Optional[str] = None
    known_for_department: Optional[str] = None


class MovieAnalysisPayload(BaseModel):
    sentiment: Optional[dict] = None
    summary: Optional[str] = None
    image_labels: Optional[List[str]] = None
    genre_predictions: Optional[List[dict]] = None
    extra: Optional[dict] = None
