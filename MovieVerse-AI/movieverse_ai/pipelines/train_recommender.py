from __future__ import annotations

import logging
import os

import mlflow

from movieverse_ai.config import settings
from movieverse_ai.data.sources import load_movies, load_ratings
from movieverse_ai.logging import configure_logging
from movieverse_ai.models.recommender import save_artifacts, train_model

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def train() -> None:
    ratings_df = load_ratings()
    movies_df = load_movies()

    artifacts, precision = train_model(ratings_df, movies_df)

    os.makedirs(settings.model_store_path, exist_ok=True)
    model_path = os.path.join(settings.model_store_path, "recommender.joblib")
    save_artifacts(model_path, artifacts)

    mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
    mlflow.set_experiment(settings.mlflow_experiment)

    with mlflow.start_run(run_name="recommender"):
        mlflow.log_metric("precision_at_10", precision)
        mlflow.log_param("model_type", "lightfm")
        mlflow.log_artifact(model_path, artifact_path="recommender")

    logger.info("recommender_trained", extra={"precision_at_10": precision})


if __name__ == "__main__":
    train()
