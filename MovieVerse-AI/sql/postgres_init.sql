CREATE TABLE IF NOT EXISTS user_events (
    event_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    rating NUMERIC(3, 2),
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events (user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_movie_id ON user_events (movie_id);
CREATE INDEX IF NOT EXISTS idx_user_events_time ON user_events (event_time);

CREATE TABLE IF NOT EXISTS ratings (
    rating_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings (user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings (movie_id);

CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews (movie_id);

CREATE TABLE IF NOT EXISTS ranking_features (
    movie_id INTEGER PRIMARY KEY,
    popularity FLOAT NOT NULL,
    avg_rating FLOAT NOT NULL,
    rating_count INTEGER NOT NULL,
    recency_days INTEGER NOT NULL,
    label FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_features (
    user_id INTEGER PRIMARY KEY,
    rating_count INTEGER NOT NULL,
    avg_rating FLOAT NOT NULL,
    recently_viewed_count INTEGER NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movie_features (
    movie_id INTEGER PRIMARY KEY,
    rating_count INTEGER NOT NULL,
    avg_rating FLOAT NOT NULL,
    popularity FLOAT NOT NULL,
    release_year INTEGER NOT NULL,
    event_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
