from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class CrawlerSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MOVIEVERSE_", case_sensitive=False)

    movie_service_url: str = Field(default="http://movie-service:8000")
    review_service_url: str = Field(default="http://review-service:8000")
    search_service_url: str = Field(default="http://search-service:8000")
    metadata_service_url: str = Field(default="http://metadata-service:8000")
    ai_service_url: str = Field(default="http://ai-api:9000")

    crawler_user_agent: str = Field(default="MovieVerseCrawler/1.0")
    crawler_timeout_seconds: int = Field(default=15)
    crawler_system_user_id: int = Field(default=0)
    crawler_max_retries: int = Field(default=3)
    crawler_retry_backoff_seconds: float = Field(default=1.5)
    crawler_max_content_bytes: int = Field(default=5_000_000)
    crawler_allowed_domains: str = Field(default="")
    crawler_default_source: str = Field(default="html")
    crawler_verify_tls: bool = Field(default=True)

    tmdb_api_key: str | None = Field(default=None)
    tmdb_base_url: str = Field(default="https://api.themoviedb.org/3")


settings = CrawlerSettings()
