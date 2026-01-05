from __future__ import annotations

from sqlalchemy import Column, DateTime, Integer, String, func

from movieverse_services.common.db import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, unique=True, index=True)
    display_name = Column(String(120), nullable=False)
    bio = Column(String(500), nullable=True)
    favorite_genres = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
