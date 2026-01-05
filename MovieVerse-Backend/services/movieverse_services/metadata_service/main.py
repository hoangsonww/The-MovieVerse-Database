from __future__ import annotations

import logging
import time

from fastapi import FastAPI, HTTPException, Query
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest
from pymongo import MongoClient
from starlette.responses import PlainTextResponse

from movieverse_services.common.config import settings
from movieverse_services.common.logging import configure_logging
from movieverse_services.common.middleware import (
    CORSMiddleware,
    ExceptionLoggingMiddleware,
    RateLimitMiddleware,
    RequestContextMiddleware,
    SecurityHeadersMiddleware,
)
from movieverse_services.metadata_service.schemas import GenrePayload, MovieAnalysisPayload, PersonPayload

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="MovieVerse Metadata Service", version="1.0.0")
app.add_middleware(RequestContextMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ExceptionLoggingMiddleware)
app.add_middleware(CORSMiddleware)

request_counter = Counter(
    "movieverse_metadata_requests_total",
    "Total requests to metadata service",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_metadata_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)

client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)

def _db():
    return client[settings.mongo_db]


def _ensure_indexes() -> None:
    db = _db()
    db.genres.create_index("genre_id", unique=True)
    db.people.create_index("person_id", unique=True)
    db.people.create_index("name")
    db.movie_analysis.create_index("movie_id", unique=True)




@app.on_event("startup")
def _startup() -> None:
    _ensure_indexes()


@app.on_event("shutdown")
def _shutdown() -> None:
    client.close()


@app.get("/healthz")
def healthcheck():
    request_counter.labels(endpoint="healthz").inc()
    return {"status": "ok"}


@app.get("/metrics", response_class=PlainTextResponse)
def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/genres")
def list_genres(limit: int = Query(default=50, ge=1, le=500), q: str | None = None):
    start = time.time()
    query = {}
    if q:
        query = {"name": {"$regex": q, "$options": "i"}}
    genres = list(_db().genres.find(query, {"_id": 0}).limit(limit))
    request_counter.labels(endpoint="list_genres").inc()
    request_latency.labels(endpoint="list_genres").observe(time.time() - start)
    return {"items": genres}


@app.get("/genres/{genre_id}")
def get_genre(genre_id: int):
    start = time.time()
    genre = _db().genres.find_one({"genre_id": genre_id}, {"_id": 0})
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")
    request_counter.labels(endpoint="get_genre").inc()
    request_latency.labels(endpoint="get_genre").observe(time.time() - start)
    return genre


@app.post("/genres")
def upsert_genres(payload: list[GenrePayload]):
    start = time.time()
    db = _db()
    upserted = 0
    for genre in payload:
        result = db.genres.update_one(
            {"genre_id": genre.genre_id},
            {"$set": {"genre_id": genre.genre_id, "name": genre.name}},
            upsert=True,
        )
        upserted += 1 if result.upserted_id or result.modified_count else 0
    request_counter.labels(endpoint="upsert_genres").inc()
    request_latency.labels(endpoint="upsert_genres").observe(time.time() - start)
    return {"status": "ok", "upserted": upserted}


@app.get("/people")
def list_people(
    limit: int = Query(default=50, ge=1, le=500),
    q: str | None = None,
    department: str | None = None,
):
    start = time.time()
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if department:
        query["known_for_department"] = department
    people = list(_db().people.find(query, {"_id": 0}).limit(limit))
    request_counter.labels(endpoint="list_people").inc()
    request_latency.labels(endpoint="list_people").observe(time.time() - start)
    return {"items": people}


@app.get("/people/{person_id}")
def get_person(person_id: int):
    start = time.time()
    person = _db().people.find_one({"person_id": person_id}, {"_id": 0})
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    request_counter.labels(endpoint="get_person").inc()
    request_latency.labels(endpoint="get_person").observe(time.time() - start)
    return person


@app.post("/people")
def upsert_people(payload: list[PersonPayload]):
    start = time.time()
    db = _db()
    upserted = 0
    for person in payload:
        result = db.people.update_one(
            {"person_id": person.person_id},
            {"$set": person.model_dump()},
            upsert=True,
        )
        upserted += 1 if result.upserted_id or result.modified_count else 0
    request_counter.labels(endpoint="upsert_people").inc()
    request_latency.labels(endpoint="upsert_people").observe(time.time() - start)
    return {"status": "ok", "upserted": upserted}


@app.get("/movies/{movie_id}/analysis")
def get_movie_analysis(movie_id: int):
    start = time.time()
    analysis = _db().movie_analysis.find_one({"movie_id": movie_id}, {"_id": 0})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    request_counter.labels(endpoint="get_movie_analysis").inc()
    request_latency.labels(endpoint="get_movie_analysis").observe(time.time() - start)
    return analysis


@app.post("/movies/{movie_id}/analysis")
def upsert_movie_analysis(movie_id: int, payload: MovieAnalysisPayload):
    start = time.time()
    db = _db()
    data = {"movie_id": movie_id, **payload.model_dump(exclude_unset=True)}
    db.movie_analysis.update_one({"movie_id": movie_id}, {"$set": data}, upsert=True)
    request_counter.labels(endpoint="upsert_movie_analysis").inc()
    request_latency.labels(endpoint="upsert_movie_analysis").observe(time.time() - start)
    return {"status": "ok", "movie_id": movie_id}
