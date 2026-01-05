from __future__ import annotations

from io import BytesIO

import boto3
import httpx
from PIL import Image
from transformers import pipeline

from movieverse_ai.config import settings


class VisionService:
    def __init__(self) -> None:
        self._pipeline = None

    def _load(self):
        if self._pipeline is None:
            self._pipeline = pipeline("image-classification", model=settings.vision_model)

    def _classify_local(self, image_bytes: bytes, max_labels: int) -> list[str]:
        self._load()
        image = Image.open(BytesIO(image_bytes))
        results = self._pipeline(image, top_k=max_labels)
        return [item["label"] for item in results]

    def _classify_aws(self, image_bytes: bytes, max_labels: int) -> list[str]:
        client = boto3.client("rekognition")
        response = client.detect_labels(Image={"Bytes": image_bytes}, MaxLabels=max_labels)
        return [label["Name"] for label in response.get("Labels", [])]

    def classify(self, image_url: str, max_labels: int) -> list[str]:
        with httpx.Client(timeout=20.0) as client:
            response = client.get(image_url)
            response.raise_for_status()
            image_bytes = response.content

        if settings.vision_provider == "aws":
            return self._classify_aws(image_bytes, max_labels)
        return self._classify_local(image_bytes, max_labels)
