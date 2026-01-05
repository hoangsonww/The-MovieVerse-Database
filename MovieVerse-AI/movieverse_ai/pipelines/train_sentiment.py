from __future__ import annotations

import logging
import os

import mlflow

from movieverse_ai.config import settings
from movieverse_ai.data.sources import load_reviews
from movieverse_ai.logging import configure_logging
from movieverse_ai.models.sentiment import save_artifacts, train_model

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def train() -> None:
    reviews_df = load_reviews()
    artifacts, accuracy = train_model(reviews_df)

    os.makedirs(settings.model_store_path, exist_ok=True)
    model_path = os.path.join(settings.model_store_path, "sentiment.joblib")
    save_artifacts(model_path, artifacts)

    mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
    mlflow.set_experiment(settings.mlflow_experiment)

    with mlflow.start_run(run_name="sentiment"):
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_param("model_type", "logistic_regression")
        mlflow.log_artifact(model_path, artifact_path="sentiment")

    logger.info("sentiment_trained", extra={"accuracy": accuracy})


if __name__ == "__main__":
    train()
