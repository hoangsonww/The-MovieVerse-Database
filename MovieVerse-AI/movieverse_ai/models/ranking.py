from __future__ import annotations

from dataclasses import dataclass

import joblib
import pandas as pd
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import HistGradientBoostingRegressor


@dataclass
class RankingArtifacts:
    scaler: StandardScaler
    model: HistGradientBoostingRegressor
    feature_columns: list[str]


def train_model(ranking_df: pd.DataFrame, target_column: str = "label") -> tuple[RankingArtifacts, float]:
    features = ranking_df.drop(columns=[target_column, "movie_id"])
    target = ranking_df[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = HistGradientBoostingRegressor(max_depth=6, learning_rate=0.1)
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    rmse = mean_squared_error(y_test, preds, squared=False)

    artifacts = RankingArtifacts(
        scaler=scaler,
        model=model,
        feature_columns=list(features.columns),
    )
    return artifacts, float(rmse)


def rank_items(artifacts: RankingArtifacts, items: list[dict]) -> list[tuple[int, float]]:
    features = pd.DataFrame(items).drop(columns=["movie_id"])
    features = features[artifacts.feature_columns]
    X_scaled = artifacts.scaler.transform(features)
    scores = artifacts.model.predict(X_scaled)
    results = [(int(items[i]["movie_id"]), float(scores[i])) for i in range(len(items))]
    return sorted(results, key=lambda item: item[1], reverse=True)


def save_artifacts(path: str, artifacts: RankingArtifacts) -> None:
    joblib.dump(artifacts, path)


def load_artifacts(path: str) -> RankingArtifacts:
    return joblib.load(path)
