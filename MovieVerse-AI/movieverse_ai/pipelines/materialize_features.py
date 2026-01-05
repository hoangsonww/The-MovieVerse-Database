from __future__ import annotations

import logging
from datetime import datetime, timedelta

from feast import FeatureStore

from movieverse_ai.config import settings
from movieverse_ai.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def materialize(days: int = 30) -> None:
    store = FeatureStore(repo_path=settings.feature_repo_path)
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    store.materialize(start_date, end_date)
    logger.info("features_materialized", extra={"start": start_date.isoformat(), "end": end_date.isoformat()})


if __name__ == "__main__":
    materialize()
