from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MOVIEVERSE_", case_sensitive=False)

    log_level: str = Field(default="INFO")
    cors_allow_origins: str = Field(default="*")
    cors_allow_methods: str = Field(default="GET,POST,PUT,DELETE,OPTIONS")
    cors_allow_headers: str = Field(default="Authorization,Content-Type,X-Request-ID")

    redis_url: str = Field(default="redis://redis:6379/0")
    rate_limit_max: int = Field(default=100)
    rate_limit_window_sec: int = Field(default=60)

    jwt_secret: str = Field(default="change-me")
    jwt_algorithm: str = Field(default="HS256")

    csp_default_src: str = Field(default="'self'")
    csp_img_src: str = Field(default="'self' data: https://image.tmdb.org")
    csp_script_src: str = Field(default="'self' https://code.jquery.com")


settings = Settings()
