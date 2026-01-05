from __future__ import annotations

import logging
import os

import mlflow

from movieverse_ai.config import settings
from movieverse_ai.data.sources import load_ranking_features
from movieverse_ai.logging import configure_logging
from movieverse_ai.models.ranking import save_artifacts, train_model

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def train() -> None:
    ranking_df = load_ranking_features()
    artifacts, rmse = train_model(ranking_df)

    os.makedirs(settings.model_store_path, exist_ok=True)
    model_path = os.path.join(settings.model_store_path, "ranking.joblib")
    save_artifacts(model_path, artifacts)

    mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
    mlflow.set_experiment(settings.mlflow_experiment)

    with mlflow.start_run(run_name="ranking"):
        mlflow.log_metric("rmse", rmse)
        mlflow.log_param("model_type", "hist_gradient_boosting")
        mlflow.log_artifact(model_path, artifact_path="ranking")

    logger.info("ranking_trained", extra={"rmse": rmse})


if __name__ == "__main__":
    train()
