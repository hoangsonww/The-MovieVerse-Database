from __future__ import annotations

import time

from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

from movieverse_ai.config import settings
from movieverse_ai.logging import configure_logging
from movieverse_ai.schemas import (
    HealthResponse,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationItem,
    SimilarMoviesRequest,
    SimilarMoviesResponse,
    SentimentRequest,
    SentimentResponse,
    RankRequest,
    RankResponse,
    SummarizeRequest,
    SummarizeResponse,
    GenreClassifyRequest,
    GenreClassifyResponse,
    VisionLabelsRequest,
    VisionLabelsResponse,
)
from movieverse_ai.services.embedding_service import EmbeddingService
from movieverse_ai.services.recommender_service import RecommenderService
from movieverse_ai.services.sentiment_service import SentimentService
from movieverse_ai.services.ranking_service import RankingService
from movieverse_ai.services.summarization_service import SummarizationService
from movieverse_ai.services.genre_service import GenreService
from movieverse_ai.services.vision_service import VisionService

configure_logging(settings.log_level)

app = FastAPI(title="MovieVerse AI", version="1.0.0")

request_counter = Counter(
    "movieverse_ai_requests_total",
    "Total requests to MovieVerse AI",
    ["endpoint"],
)
request_latency = Histogram(
    "movieverse_ai_request_latency_seconds",
    "Request latency",
    ["endpoint"],
)

recommender_service = RecommenderService()
embedding_service = EmbeddingService()
sentiment_service = SentimentService()
ranking_service = RankingService()
summarization_service = SummarizationService()
genre_service = GenreService()
vision_service = VisionService()


@app.get("/healthz", response_model=HealthResponse)
def health_check() -> HealthResponse:
    request_counter.labels(endpoint="healthz").inc()
    return HealthResponse(status="ok")


@app.get("/metrics", response_class=PlainTextResponse)
def metrics() -> PlainTextResponse:
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest) -> RecommendationResponse:
    start = time.time()
    try:
        items = recommender_service.recommend(
            payload.user_id, payload.limit, payload.filter_genres
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    response = RecommendationResponse(
        user_id=payload.user_id,
        items=[RecommendationItem(movie_id=movie_id, score=score) for movie_id, score in items],
    )
    request_counter.labels(endpoint="recommendations").inc()
    request_latency.labels(endpoint="recommendations").observe(time.time() - start)
    return response


@app.post("/similar", response_model=SimilarMoviesResponse)
def similar_movies(payload: SimilarMoviesRequest) -> SimilarMoviesResponse:
    start = time.time()
    try:
        items = embedding_service.similar_movies(payload.movie_id, payload.limit)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    response = SimilarMoviesResponse(
        movie_id=payload.movie_id,
        items=[RecommendationItem(movie_id=movie_id, score=score) for movie_id, score in items],
    )
    request_counter.labels(endpoint="similar").inc()
    request_latency.labels(endpoint="similar").observe(time.time() - start)
    return response


@app.post("/sentiment", response_model=SentimentResponse)
def sentiment(payload: SentimentRequest) -> SentimentResponse:
    start = time.time()
    try:
        label, score = sentiment_service.analyze(payload.text)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    response = SentimentResponse(label=label, score=score)
    request_counter.labels(endpoint="sentiment").inc()
    request_latency.labels(endpoint="sentiment").observe(time.time() - start)
    return response


@app.post("/rank", response_model=RankResponse)
def rank(payload: RankRequest) -> RankResponse:
    start = time.time()
    items = []
    for item in payload.items:
        record = {"movie_id": item.movie_id, **item.features}
        items.append(record)

    try:
        ranked = ranking_service.rank(items)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    response = RankResponse(
        ranked_items=[RecommendationItem(movie_id=movie_id, score=score) for movie_id, score in ranked]
    )
    request_counter.labels(endpoint="rank").inc()
    request_latency.labels(endpoint="rank").observe(time.time() - start)
    return response


@app.post("/summarize", response_model=SummarizeResponse)
def summarize(payload: SummarizeRequest) -> SummarizeResponse:
    start = time.time()
    summary = summarization_service.summarize(
        payload.text,
        payload.max_length,
        payload.min_length,
        payload.style,
    )
    response = SummarizeResponse(summary=summary)
    request_counter.labels(endpoint="summarize").inc()
    request_latency.labels(endpoint="summarize").observe(time.time() - start)
    return response


@app.post("/genres/classify", response_model=GenreClassifyResponse)
def classify_genre(payload: GenreClassifyRequest) -> GenreClassifyResponse:
    start = time.time()
    predictions = genre_service.classify(payload.text, payload.top_k)
    response = GenreClassifyResponse(predictions=predictions)
    request_counter.labels(endpoint="genres_classify").inc()
    request_latency.labels(endpoint="genres_classify").observe(time.time() - start)
    return response


@app.post("/vision/labels", response_model=VisionLabelsResponse)
def classify_image(payload: VisionLabelsRequest) -> VisionLabelsResponse:
    start = time.time()
    labels = vision_service.classify(payload.image_url, payload.max_labels)
    response = VisionLabelsResponse(labels=labels)
    request_counter.labels(endpoint="vision_labels").inc()
    request_latency.labels(endpoint="vision_labels").observe(time.time() - start)
    return response
