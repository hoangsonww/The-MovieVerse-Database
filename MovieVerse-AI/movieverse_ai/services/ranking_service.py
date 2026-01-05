from __future__ import annotations

import os

from movieverse_ai.config import settings
from movieverse_ai.models.ranking import load_artifacts, rank_items, RankingArtifacts
from movieverse_ai.services.model_registry import download_latest_artifact


class RankingService:
    def __init__(self, model_path: str | None = None) -> None:
        self.model_path = model_path or os.path.join(settings.model_store_path, "ranking.joblib")
        self._artifacts: RankingArtifacts | None = None

    def load(self) -> None:
        try:
            self._artifacts = load_artifacts(self.model_path)
        except FileNotFoundError:
            download_latest_artifact("ranking", "ranking", settings.model_store_path)
            self._artifacts = load_artifacts(self.model_path)

    def rank(self, items: list[dict]) -> list[tuple[int, float]]:
        if self._artifacts is None:
            self.load()
        return rank_items(self._artifacts, items)
