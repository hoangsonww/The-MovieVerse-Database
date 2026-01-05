from __future__ import annotations

import logging
import os

import mlflow

from movieverse_ai.config import settings
from movieverse_ai.data.sources import load_movies
from movieverse_ai.logging import configure_logging
from movieverse_ai.models.embeddings import build_embeddings, save_artifacts

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def build() -> None:
    movies_df = load_movies()
    artifacts = build_embeddings(movies_df)

    os.makedirs(settings.index_store_path, exist_ok=True)
    save_artifacts(settings.index_store_path, artifacts)

    mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
    mlflow.set_experiment(settings.mlflow_experiment)

    with mlflow.start_run(run_name="embeddings"):
        mlflow.log_param("model_type", "sentence_transformer")
        mlflow.log_param("model_name", artifacts.model_name)
        mlflow.log_artifacts(settings.index_store_path, artifact_path="embeddings")

    logger.info("embeddings_built", extra={"movie_count": len(artifacts.movie_ids)})


if __name__ == "__main__":
    build()
