from __future__ import annotations

from transformers import pipeline

from movieverse_ai.config import settings


class SummarizationService:
    def __init__(self, model_name: str | None = None) -> None:
        self.model_name = model_name or settings.summarizer_model
        self._pipeline = None

    def _load(self):
        if self._pipeline is None:
            self._pipeline = pipeline("summarization", model=self.model_name)

    def summarize(self, text: str, max_length: int | None, min_length: int | None, style: str) -> str:
        self._load()
        max_len = max_length or 130
        min_len = min_length or 30

        if style == "verbose":
            max_len = min(max_len * 2, 512)
            min_len = min(min_len * 2, max_len - 1)
        elif style == "concise":
            max_len = max(max_len // 2, 30)
            min_len = max(min_len // 2, 10)

        result = self._pipeline(
            text,
            max_length=max_len,
            min_length=min_len,
            do_sample=False,
            truncation=True,
        )
        return result[0]["summary_text"]
