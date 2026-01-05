from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from lightfm import LightFM
from lightfm.data import Dataset
from lightfm.evaluation import precision_at_k


@dataclass
class RecommenderArtifacts:
    model: LightFM
    dataset: Dataset
    item_features: np.ndarray
    user_mapping: Dict[int, int]
    item_mapping: Dict[int, int]
    reverse_item_mapping: Dict[int, int]
    item_genres: Dict[int, List[str]]


def _parse_genres(genres_value: str | None) -> List[str]:
    if not genres_value:
        return []
    if isinstance(genres_value, str):
        if "|" in genres_value:
            return [g.strip() for g in genres_value.split("|") if g.strip()]
        if "," in genres_value:
            return [g.strip() for g in genres_value.split(",") if g.strip()]
        return [genres_value.strip()]
    return []


def build_dataset(
    ratings_df: pd.DataFrame, movies_df: pd.DataFrame
) -> Tuple[Dataset, np.ndarray, Dict[int, int], Dict[int, int]]:
    dataset = Dataset()

    users = ratings_df["user_id"].unique().tolist()
    items = movies_df["movie_id"].unique().tolist()
    all_genres = sorted({g for genres in movies_df["genres"].fillna("") for g in _parse_genres(genres)})

    dataset.fit(users=users, items=items, item_features=all_genres)

    interactions, _ = dataset.build_interactions(
        ((row.user_id, row.movie_id, float(row.rating)) for row in ratings_df.itertuples())
    )

    item_features = dataset.build_item_features(
        ((row.movie_id, _parse_genres(row.genres)) for row in movies_df.itertuples())
    )

    user_mapping, item_mapping, _, _ = dataset.mapping()
    return dataset, interactions, item_features, user_mapping, item_mapping


def train_model(
    ratings_df: pd.DataFrame,
    movies_df: pd.DataFrame,
    no_components: int = 64,
    epochs: int = 20,
    learning_rate: float = 0.05,
) -> Tuple[RecommenderArtifacts, float]:
    dataset, interactions, item_features, user_mapping, item_mapping = build_dataset(
        ratings_df, movies_df
    )

    model = LightFM(
        no_components=no_components,
        learning_rate=learning_rate,
        loss="warp",
        random_state=42,
    )
    model.fit(interactions, item_features=item_features, epochs=epochs, num_threads=4)

    prec = precision_at_k(model, interactions, item_features=item_features, k=10).mean()

    reverse_item_mapping = {idx: movie_id for movie_id, idx in item_mapping.items()}
    item_genres = {
        int(row.movie_id): _parse_genres(row.genres) for row in movies_df.itertuples()
    }
    artifacts = RecommenderArtifacts(
        model=model,
        dataset=dataset,
        item_features=item_features,
        user_mapping=user_mapping,
        item_mapping=item_mapping,
        reverse_item_mapping=reverse_item_mapping,
        item_genres=item_genres,
    )
    return artifacts, float(prec)


def recommend(
    artifacts: RecommenderArtifacts,
    user_id: int,
    limit: int = 10,
    filter_genres: List[str] | None = None,
) -> List[tuple[int, float]]:
    if user_id not in artifacts.user_mapping:
        return []

    user_index = artifacts.user_mapping[user_id]
    item_indices = np.arange(len(artifacts.item_mapping))
    scores = artifacts.model.predict(user_index, item_indices, item_features=artifacts.item_features)

    ranked_indices = np.argsort(-scores)
    results: List[tuple[int, float]] = []

    for idx in ranked_indices:
        movie_id = artifacts.reverse_item_mapping.get(int(idx))
        if movie_id is None:
            continue
        if filter_genres:
            genres = artifacts.item_genres.get(movie_id, [])
            if not set(filter_genres).intersection(genres):
                continue
        score = float(scores[idx])
        results.append((movie_id, score))
        if len(results) >= limit:
            break
    return results


def save_artifacts(path: str, artifacts: RecommenderArtifacts) -> None:
    joblib.dump(artifacts, path)


def load_artifacts(path: str) -> RecommenderArtifacts:
    return joblib.load(path)
