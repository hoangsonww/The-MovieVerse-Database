from datetime import timedelta

from feast import Entity, FeatureView, Field
from feast.types import Float32, Int32
from feast.infra.offline_stores.contrib.postgres_offline_store.postgres_source import (
    PostgreSQLSource,
)

user = Entity(name="user_id", join_keys=["user_id"])
movie = Entity(name="movie_id", join_keys=["movie_id"])

user_source = PostgreSQLSource(
    name="user_features",
    query="SELECT user_id, rating_count, avg_rating, recently_viewed_count, event_time FROM user_features",
    timestamp_field="event_time",
)

movie_source = PostgreSQLSource(
    name="movie_features",
    query="SELECT movie_id, rating_count, avg_rating, popularity, release_year, event_time FROM movie_features",
    timestamp_field="event_time",
)

user_features = FeatureView(
    name="user_features",
    entities=[user],
    ttl=timedelta(days=30),
    schema=[
        Field(name="rating_count", dtype=Int32),
        Field(name="avg_rating", dtype=Float32),
        Field(name="recently_viewed_count", dtype=Int32),
    ],
    online=True,
    source=user_source,
    tags={"team": "movieverse-ai"},
)

movie_features = FeatureView(
    name="movie_features",
    entities=[movie],
    ttl=timedelta(days=365),
    schema=[
        Field(name="rating_count", dtype=Int32),
        Field(name="avg_rating", dtype=Float32),
        Field(name="popularity", dtype=Float32),
        Field(name="release_year", dtype=Int32),
    ],
    online=True,
    source=movie_source,
    tags={"team": "movieverse-ai"},
)
