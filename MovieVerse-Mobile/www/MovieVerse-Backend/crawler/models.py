from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ReviewItem:
    author: str
    content: str
    rating: float


@dataclass
class MovieDetail:
    name: str
    description: str
    poster_url: str
    cast: List[str]
    director: str
    genres: List[str]
    duration: str
    rating: float
    release_date: str
    trailer_url: str
    imdb_url: str
    rotten_tomatoes_url: str
    metacritic_url: str
    reviews: List[ReviewItem]
    similar_movies: List[dict]
    recommendations: List[dict]
    awards: str
    box_office: str
    budget: str
    company: str
    country: str
    language: str
    tagline: str
    website: str
    writers: List[str]
    year: int
    imdb_id: str
    imdb_rating: float
    imdb_votes: int
    metascore: int
    rotten_tomatoes_rating: int
    rotten_tomatoes_reviews: int
    rotten_tomatoes_fresh: int


@dataclass
class CrawlJob:
    url: str
    source: str | None = None
    tags: List[str] = field(default_factory=list)
    priority: int = 0
    job_id: str | None = None


@dataclass
class MoviePayload:
    title: str
    overview: str | None = None
    genres: List[str] = field(default_factory=list)
    release_date: str | None = None
    rating: float | None = None
    popularity: float | None = None
    poster_url: str | None = None
    tmdb_id: int | None = None
    imdb_id: str | None = None


@dataclass
class ReviewPayload:
    user_id: int
    movie_id: int
    rating: float
    review_text: str
    author: str | None = None


@dataclass
class CrawlAnalysis:
    sentiment: dict | None = None
    summary: str | None = None
    image_labels: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    source: str | None = None
    extra: dict | None = None
