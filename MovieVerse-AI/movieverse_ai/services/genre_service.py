from __future__ import annotations

from transformers import pipeline

from movieverse_ai.config import settings


class GenreService:
    def __init__(self, model_name: str | None = None) -> None:
        self.model_name = model_name or settings.genre_zero_shot_model
        self._pipeline = None
        self._labels = [label.strip() for label in settings.genre_labels.split(",") if label.strip()]

    def _load(self):
        if self._pipeline is None:
            self._pipeline = pipeline("zero-shot-classification", model=self.model_name)

    def classify(self, text: str, top_k: int) -> list[dict]:
        self._load()
        result = self._pipeline(text, candidate_labels=self._labels, multi_label=True)
        labels = result.get("labels", [])
        scores = result.get("scores", [])
        predictions = [
            {"label": label, "score": float(score)}
            for label, score in zip(labels, scores)
        ]
        return predictions[:top_k]
