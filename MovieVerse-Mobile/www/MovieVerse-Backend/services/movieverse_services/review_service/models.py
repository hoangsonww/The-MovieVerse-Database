from __future__ import annotations

from sqlalchemy import Column, DateTime, Float, Integer, String, func

from movieverse_services.common.db import Base


class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    movie_id = Column(Integer, nullable=False, index=True)
    rating = Column(Float, nullable=False)
    review_text = Column(String(2000), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
