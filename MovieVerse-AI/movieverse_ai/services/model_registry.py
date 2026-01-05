from __future__ import annotations

import logging
import os

import mlflow
from mlflow.tracking import MlflowClient

from movieverse_ai.config import settings
from movieverse_ai.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def download_latest_artifact(run_name: str, artifact_path: str, output_dir: str) -> str:
    mlflow.set_tracking_uri(settings.mlflow_tracking_uri)
    client = MlflowClient()

    experiment = client.get_experiment_by_name(settings.mlflow_experiment)
    if not experiment:
        raise RuntimeError("MLflow experiment not found")

    runs = client.search_runs(
        experiment_ids=[experiment.experiment_id],
        filter_string=f"tags.mlflow.runName = '{run_name}'",
        order_by=["attributes.start_time DESC"],
        max_results=1,
    )
    if not runs:
        raise RuntimeError(f"No runs found for {run_name}")

    run_id = runs[0].info.run_id
    os.makedirs(output_dir, exist_ok=True)
    local_path = client.download_artifacts(run_id, artifact_path, output_dir)
    logger.info("artifact_downloaded", extra={"run_name": run_name, "path": local_path})
    return local_path
