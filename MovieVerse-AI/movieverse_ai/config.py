from __future__ import annotations

from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="MOVIEVERSE_AI_", case_sensitive=False)

    app_env: str = Field(default="production")
    log_level: str = Field(default="INFO")
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=9000)

    postgres_dsn: str = Field(
        default="postgresql+psycopg2://movieverse:movieverse@postgres:5432/movieverse_ai"
    )
    mysql_dsn: str = Field(
        default="mysql+pymysql://movieverse:movieverse@mysql:3306/movieverse"
    )
    mongo_uri: str = Field(default="mongodb://movieverse:movieverse@mongodb:27017")
    redis_url: str = Field(default="redis://redis:6379/0")

    kafka_bootstrap_servers: str = Field(default="kafka:9092")
    kafka_consumer_group: str = Field(default="movieverse-ai-consumer")
    kafka_events_topic: str = Field(default="movieverse.events")

    mlflow_tracking_uri: str = Field(default="http://mlflow:5000")
    mlflow_experiment: str = Field(default="movieverse-ai")

    s3_endpoint_url: str = Field(default="http://minio:9000")
    s3_bucket: str = Field(default="movieverse-ml")
    s3_access_key: str = Field(default="movieverse")
    s3_secret_key: str = Field(default="movieverse")

    model_store_path: str = Field(default=str(BASE_DIR / "models"))
    index_store_path: str = Field(default=str(BASE_DIR / "index"))
    feature_repo_path: str = Field(default=str(BASE_DIR / "feature_repo"))

    summarizer_model: str = Field(default="facebook/bart-large-cnn")
    genre_zero_shot_model: str = Field(default="facebook/bart-large-mnli")
    genre_labels: str = Field(
        default="Action,Adventure,Animation,Comedy,Crime,Documentary,Drama,Family,Fantasy,History,Horror,Music,Mystery,Romance,Sci-Fi,Thriller,War,Western"
    )
    vision_model: str = Field(default="google/vit-base-patch16-224")
    vision_provider: str = Field(default="local")


settings = Settings()
