from __future__ import annotations

import json
import logging
import os

import pandas as pd
from scipy.stats import ks_2samp

from movieverse_ai.config import settings
from movieverse_ai.data.sources import get_postgres_engine
from movieverse_ai.logging import configure_logging

configure_logging(settings.log_level)
logger = logging.getLogger(__name__)


def _load_events(days: int) -> pd.DataFrame:
    query = (
        "SELECT user_id, movie_id, rating, event_type, event_time "
        "FROM user_events WHERE event_time >= NOW() - INTERVAL ':days days'"
    )
    with get_postgres_engine().connect() as conn:
        return pd.read_sql(query.replace(":days", str(days)), conn)


def _numeric_drift(reference: pd.DataFrame, current: pd.DataFrame) -> dict:
    report = {}
    numeric_cols = reference.select_dtypes(include=["number"]).columns
    for col in numeric_cols:
        ref = reference[col].dropna()
        cur = current[col].dropna()
        if ref.empty or cur.empty:
            continue
        stat, pvalue = ks_2samp(ref, cur)
        report[col] = {
            "ks_stat": float(stat),
            "p_value": float(pvalue),
            "drift_detected": pvalue < 0.05,
        }
    return report


def monitor() -> str:
    reference = _load_events(60)
    current = _load_events(7)

    drift_report = {
        "reference_window_days": 60,
        "current_window_days": 7,
        "row_counts": {"reference": len(reference), "current": len(current)},
        "numeric_drift": _numeric_drift(reference, current),
    }

    output_dir = os.path.join(settings.model_store_path, "monitoring")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "drift_report.json")

    with open(output_path, "w", encoding="utf-8") as handle:
        json.dump(drift_report, handle, indent=2)

    logger.info("drift_report_generated", extra={"path": output_path})
    return output_path


if __name__ == "__main__":
    monitor()
