from __future__ import annotations

from dataclasses import dataclass

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split


@dataclass
class SentimentArtifacts:
    vectorizer: TfidfVectorizer
    model: LogisticRegression


def train_model(reviews_df: pd.DataFrame) -> tuple[SentimentArtifacts, float]:
    reviews_df = reviews_df.dropna(subset=["review_text", "rating"]).copy()
    reviews_df["label"] = np.where(reviews_df["rating"] >= 4, 1, 0)

    X_train, X_test, y_train, y_test = train_test_split(
        reviews_df["review_text"], reviews_df["label"], test_size=0.2, random_state=42
    )

    vectorizer = TfidfVectorizer(max_features=50000, ngram_range=(1, 2))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = LogisticRegression(max_iter=200)
    model.fit(X_train_vec, y_train)

    preds = model.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)

    artifacts = SentimentArtifacts(vectorizer=vectorizer, model=model)
    return artifacts, float(acc)


def predict(artifacts: SentimentArtifacts, text: str) -> tuple[str, float]:
    vec = artifacts.vectorizer.transform([text])
    prob = artifacts.model.predict_proba(vec)[0][1]
    label = "positive" if prob >= 0.5 else "negative"
    return label, float(prob)


def save_artifacts(path: str, artifacts: SentimentArtifacts) -> None:
    joblib.dump(artifacts, path)


def load_artifacts(path: str) -> SentimentArtifacts:
    return joblib.load(path)
