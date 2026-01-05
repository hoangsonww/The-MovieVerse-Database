from __future__ import annotations

from sqlalchemy import Column, Date, Float, Integer, String

from movieverse_services.common.db import Base


class Movie(Base):
    __tablename__ = "movies"

    movie_id = Column(Integer, primary_key=True, autoincrement=True)
    tmdb_id = Column(Integer, unique=True, nullable=True)
    title = Column(String(255), nullable=False)
    overview = Column(String(2000), nullable=True)
    genres = Column(String(255), nullable=True)
    release_date = Column(Date, nullable=True)
    rating = Column(Float, nullable=True)
    popularity = Column(Float, nullable=True)
