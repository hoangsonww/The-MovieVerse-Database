from __future__ import annotations

import logging
import os

from movieverse_ai.config import settings
from movieverse_ai.logging import configure_logging
from movieverse_ai.services.model_registry import download_latest_artifact

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def sync() -> None:
    os.makedirs(settings.model_store_path, exist_ok=True)
    os.makedirs(settings.index_store_path, exist_ok=True)

    download_latest_artifact("recommender", "recommender", settings.model_store_path)
    download_latest_artifact("sentiment", "sentiment", settings.model_store_path)
    download_latest_artifact("ranking", "ranking", settings.model_store_path)
    download_latest_artifact("embeddings", "embeddings", settings.index_store_path)

    logger.info("models_synced")


if __name__ == "__main__":
    sync()
