from __future__ import annotations

from pydantic import BaseModel, Field


class ProfileCreate(BaseModel):
    user_id: int
    display_name: str = Field(min_length=1, max_length=120)
    bio: str | None = Field(default=None, max_length=500)
    favorite_genres: str | None = Field(default=None, max_length=255)


class ProfileUpdate(BaseModel):
    display_name: str | None = Field(default=None, max_length=120)
    bio: str | None = Field(default=None, max_length=500)
    favorite_genres: str | None = Field(default=None, max_length=255)


class ProfileResponse(BaseModel):
    user_id: int
    display_name: str
    bio: str | None
    favorite_genres: str | None
