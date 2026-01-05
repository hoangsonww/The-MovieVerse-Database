from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import List

import faiss
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer


@dataclass
class EmbeddingArtifacts:
    index: faiss.Index
    movie_ids: List[int]
    model_name: str
    id_to_index: dict[int, int]


def build_embeddings(
    movies_df: pd.DataFrame,
    model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
) -> EmbeddingArtifacts:
    texts = (
        movies_df[["title", "overview"]]
        .fillna("")
        .agg(" ".join, axis=1)
        .tolist()
    )
    movie_ids = movies_df["movie_id"].astype(int).tolist()

    model = SentenceTransformer(model_name)
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=True)
    embeddings = np.asarray(embeddings, dtype="float32")

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)
    id_to_index = {movie_id: idx for idx, movie_id in enumerate(movie_ids)}
    return EmbeddingArtifacts(index=index, movie_ids=movie_ids, model_name=model_name, id_to_index=id_to_index)


def save_artifacts(path: str, artifacts: EmbeddingArtifacts) -> None:
    os.makedirs(path, exist_ok=True)
    index_path = os.path.join(path, "faiss.index")
    meta_path = os.path.join(path, "metadata.json")
    faiss.write_index(artifacts.index, index_path)
    with open(meta_path, "w", encoding="utf-8") as handle:
        json.dump(
            {
                "movie_ids": artifacts.movie_ids,
                "model_name": artifacts.model_name,
            },
            handle,
        )


def load_artifacts(path: str) -> EmbeddingArtifacts:
    index_path = os.path.join(path, "faiss.index")
    meta_path = os.path.join(path, "metadata.json")
    index = faiss.read_index(index_path)
    with open(meta_path, "r", encoding="utf-8") as handle:
        meta = json.load(handle)
    movie_ids = meta["movie_ids"]
    id_to_index = {movie_id: idx for idx, movie_id in enumerate(movie_ids)}
    return EmbeddingArtifacts(index=index, movie_ids=movie_ids, model_name=meta["model_name"], id_to_index=id_to_index)


def find_similar(artifacts: EmbeddingArtifacts, movie_id: int, limit: int = 10):
    if movie_id not in artifacts.id_to_index:
        return []
    idx = artifacts.id_to_index[movie_id]
    vector = artifacts.index.reconstruct(idx)
    scores, indices = artifacts.index.search(np.asarray([vector]), limit + 1)
    results = []
    for score, index in zip(scores[0], indices[0]):
        if index == idx:
            continue
        results.append((artifacts.movie_ids[index], float(score)))
        if len(results) >= limit:
            break
    return results
