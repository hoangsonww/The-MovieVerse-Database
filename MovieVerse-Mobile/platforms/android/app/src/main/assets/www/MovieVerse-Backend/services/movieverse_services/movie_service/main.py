from __future__ import annotations

import logging
import time

from fastapi import Depends, FastAPI, HTTPException, Query, status
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from sqlalchemy import select
from sqlalchemy.orm import Session
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.db import Base, maybe_create_schema, mysql_engine, session_factory
from movieverse_services.common.events import publish_kafka_event
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.movie_service.models import Movie
from movieverse_services.movie_service.schemas import MovieCreate, MovieResponse, MovieUpdate

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

engine = mysql_engine()
SessionLocal = session_factory(engine)

app = FastAPI(title="MovieVerse Movie Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_movie_requests_total",
    "Total requests to movie service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_movie_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)


@app.on_event("startup")
def _startup() -> None:
    maybe_create_schema(engine)


@app.on_event("shutdown")
def _shutdown() -> None:
    engine.dispose()


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/movies", response_model=list[MovieResponse])
def list_movies(
    session: Session = Depends(get_session),
    limit: int = Query(default=50, ge=1, le=200),
    genre: str | None = None,
):
    start = time.time()
    query = select(Movie)
    if genre:
        query = query.where(Movie.genres.contains(genre))
    query = query.limit(limit)
    movies = session.execute(query).scalars().all()

    request_counter.labels(endpoint="list_movies").inc()
    request_latency.labels(endpoint="list_movies").observe(time.time() - start)
    return [
        MovieResponse(
            movie_id=movie.movie_id,
            tmdb_id=movie.tmdb_id,
            title=movie.title,
            overview=movie.overview,
            genres=movie.genres,
            release_date=movie.release_date,
            rating=movie.rating,
            popularity=movie.popularity,
        )
        for movie in movies
    ]


@app.get("/movies/{movie_id}", response_model=MovieResponse)
def get_movie(movie_id: int, session: Session = Depends(get_session)):
    start = time.time()
    movie = session.get(Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    request_counter.labels(endpoint="get_movie").inc()
    request_latency.labels(endpoint="get_movie").observe(time.time() - start)
    return MovieResponse(
        movie_id=movie.movie_id,
        tmdb_id=movie.tmdb_id,
        title=movie.title,
        overview=movie.overview,
        genres=movie.genres,
        release_date=movie.release_date,
        rating=movie.rating,
        popularity=movie.popularity,
    )


@app.post("/movies", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def create_movie(payload: MovieCreate, session: Session = Depends(get_session)):
    start = time.time()
    movie = Movie(
        tmdb_id=payload.tmdb_id,
        title=payload.title,
        overview=payload.overview,
        genres=payload.genres,
        release_date=payload.release_date,
        rating=payload.rating,
        popularity=payload.popularity,
    )
    session.add(movie)
    session.commit()
    session.refresh(movie)

    publish_kafka_event("movie_created", {"movie_id": movie.movie_id, "title": movie.title})

    request_counter.labels(endpoint="create_movie").inc()
    request_latency.labels(endpoint="create_movie").observe(time.time() - start)
    return MovieResponse(
        movie_id=movie.movie_id,
        tmdb_id=movie.tmdb_id,
        title=movie.title,
        overview=movie.overview,
        genres=movie.genres,
        release_date=movie.release_date,
        rating=movie.rating,
        popularity=movie.popularity,
    )


@app.put("/movies/{movie_id}", response_model=MovieResponse)
def update_movie(movie_id: int, payload: MovieUpdate, session: Session = Depends(get_session)):
    start = time.time()
    movie = session.get(Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(movie, field, value)

    session.commit()
    session.refresh(movie)

    publish_kafka_event("movie_updated", {"movie_id": movie.movie_id, "title": movie.title})

    request_counter.labels(endpoint="update_movie").inc()
    request_latency.labels(endpoint="update_movie").observe(time.time() - start)
    return MovieResponse(
        movie_id=movie.movie_id,
        tmdb_id=movie.tmdb_id,
        title=movie.title,
        overview=movie.overview,
        genres=movie.genres,
        release_date=movie.release_date,
        rating=movie.rating,
        popularity=movie.popularity,
    )


@app.post("/movies/import", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def import_movie(payload: MovieCreate, session: Session = Depends(get_session)):
    start = time.time()
    movie = None
    if payload.tmdb_id is not None:
        movie = session.query(Movie).filter(Movie.tmdb_id == payload.tmdb_id).first()
    if movie is None:
        movie = session.query(Movie).filter(Movie.title == payload.title).first()

    if movie:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(movie, field, value)
        session.commit()
        session.refresh(movie)
        event_type = "movie_updated"
    else:
        movie = Movie(
            tmdb_id=payload.tmdb_id,
            title=payload.title,
            overview=payload.overview,
            genres=payload.genres,
            release_date=payload.release_date,
            rating=payload.rating,
            popularity=payload.popularity,
        )
        session.add(movie)
        session.commit()
        session.refresh(movie)
        event_type = "movie_created"

    publish_kafka_event(event_type, {"movie_id": movie.movie_id, "title": movie.title})

    request_counter.labels(endpoint="import_movie").inc()
    request_latency.labels(endpoint="import_movie").observe(time.time() - start)
    return MovieResponse(
        movie_id=movie.movie_id,
        tmdb_id=movie.tmdb_id,
        title=movie.title,
        overview=movie.overview,
        genres=movie.genres,
        release_date=movie.release_date,
        rating=movie.rating,
        popularity=movie.popularity,
    )
