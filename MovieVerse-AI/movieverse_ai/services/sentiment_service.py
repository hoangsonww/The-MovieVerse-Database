from __future__ import annotations

import os

from movieverse_ai.config import settings
from movieverse_ai.models.sentiment import load_artifacts, predict, SentimentArtifacts
from movieverse_ai.services.model_registry import download_latest_artifact


class SentimentService:
    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = model_path or os.path.join(settings.model_store_path, "sentiment.joblib")
        self._artifacts: SentimentArtifacts | None = None

    def load(self) -> None:
        try:
            self._artifacts = load_artifacts(self.model_path)
        except FileNotFoundError:
            download_latest_artifact("sentiment", "sentiment", settings.model_store_path)
            self._artifacts = load_artifacts(self.model_path)

    def analyze(self, text: str) -> tuple[str, float]:
        if self._artifacts is None:
            self.load()
        return predict(self._artifacts, text)
