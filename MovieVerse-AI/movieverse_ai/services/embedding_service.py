from __future__ import annotations

import os

from movieverse_ai.config import settings
from movieverse_ai.models.embeddings import EmbeddingArtifacts, find_similar, load_artifacts
from movieverse_ai.services.model_registry import download_latest_artifact


class EmbeddingService:
    def __init__(self, index_path: str | None = None) -> None:
        self.index_path = index_path or settings.index_store_path
        self._artifacts: EmbeddingArtifacts | None = None

    def load(self) -> None:
        try:
            self._artifacts = load_artifacts(self.index_path)
        except FileNotFoundError:
            download_latest_artifact("embeddings", "embeddings", settings.index_store_path)
            self._artifacts = load_artifacts(self.index_path)

    def similar_movies(self, movie_id: int, limit: int) -> list[tuple[int, float]]:
        if self._artifacts is None:
            self.load()
        return find_similar(self._artifacts, movie_id, limit=limit)
