from __future__ import annotations

import logging
from typing import Any, Optional

import httpx

from crawler.config import settings

logger = logging.getLogger(__name__)


def _client() -> httpx.Client:
    return httpx.Client(base_url=settings.ai_service_url, timeout=20.0)


def analyze_sentiment(text: str) -> Optional[dict]:
    try:
        with _client() as client:
            response = client.post("/sentiment", json={"text": text})
            response.raise_for_status()
            return response.json()
    except Exception as exc:
        logger.warning("sentiment_failed", extra={"error": str(exc)})
        return None


def summarize_text(text: str, style: str = "default") -> Optional[str]:
    try:
        with _client() as client:
            response = client.post(
                "/summarize",
                json={"text": text, "style": style},
            )
            response.raise_for_status()
            return response.json().get("summary")
    except Exception as exc:
        logger.warning("summary_failed", extra={"error": str(exc)})
        return None


def classify_genre(text: str, top_k: int = 3) -> Optional[list[dict]]:
    try:
        with _client() as client:
            response = client.post(
                "/genres/classify",
                json={"text": text, "top_k": top_k},
            )
            response.raise_for_status()
            return response.json().get("predictions")
    except Exception as exc:
        logger.warning("genre_classification_failed", extra={"error": str(exc)})
        return None


def classify_image(image_url: str, max_labels: int = 5) -> Optional[list[str]]:
    try:
        with _client() as client:
            response = client.post(
                "/vision/labels",
                json={"image_url": image_url, "max_labels": max_labels},
            )
            response.raise_for_status()
            return response.json().get("labels")
    except Exception as exc:
        logger.warning("image_classification_failed", extra={"error": str(exc)})
        return None
