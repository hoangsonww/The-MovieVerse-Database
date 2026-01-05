from __future__ import annotations

import os
from typing import List

from movieverse_ai.config import settings
from movieverse_ai.models.recommender import load_artifacts, recommend, RecommenderArtifacts
from movieverse_ai.services.model_registry import download_latest_artifact


class RecommenderService:
    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = model_path or os.path.join(settings.model_store_path, "recommender.joblib")
        self._artifacts: RecommenderArtifacts | None = None

    def load(self) -> None:
        try:
            self._artifacts = load_artifacts(self.model_path)
        except FileNotFoundError:
            download_latest_artifact("recommender", "recommender", settings.model_store_path)
            self._artifacts = load_artifacts(self.model_path)

    def recommend(self, user_id: int, limit: int, filter_genres: List[str] | None) -> list[tuple[int, float]]:
        if self._artifacts is None:
            self.load()
        return recommend(self._artifacts, user_id, limit=limit, filter_genres=filter_genres)
