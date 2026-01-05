microservices = {
    "auth_service": {
        "description": "Handles registration, login, and JWT issuance",
        "framework": "FastAPI",
        "database": "PostgreSQL + Redis",
        "endpoints": ["/register", "/login", "/refresh"],
    },
    "user_service": {
        "description": "Manages user profiles and preferences",
        "framework": "FastAPI",
        "database": "PostgreSQL",
        "endpoints": ["/profiles", "/profiles/{user_id}"],
    },
    "movie_service": {
        "description": "Movie catalog, metadata, and ingestion upserts",
        "framework": "FastAPI",
        "database": "MySQL",
        "endpoints": ["/movies", "/movies/{movie_id}", "/movies/import"],
    },
    "review_service": {
        "description": "Ratings and reviews with Kafka/RabbitMQ events",
        "framework": "FastAPI",
        "database": "PostgreSQL",
        "endpoints": ["/reviews", "/reviews/movies/{movie_id}", "/reviews/users/{user_id}"],
    },
    "recommendation_service": {
        "description": "AI-backed recommendations and personalization",
        "framework": "FastAPI",
        "database": "Redis + MovieVerse-AI",
        "endpoints": ["/recommendations"],
    },
    "search_service": {
        "description": "OpenSearch-backed movie/review search",
        "framework": "FastAPI",
        "database": "OpenSearch",
        "endpoints": ["/search", "/search/reviews", "/index", "/index/review"],
    },
    "search_indexer_service": {
        "description": "Kafka-driven indexing and reindex endpoints",
        "framework": "FastAPI",
        "database": "MySQL + PostgreSQL + OpenSearch",
        "endpoints": ["/reindex/movies", "/reindex/reviews"],
    },
    "notification_service": {
        "description": "Notification API and RabbitMQ worker",
        "framework": "FastAPI",
        "database": "PostgreSQL + RabbitMQ",
        "endpoints": ["/notifications"],
    },
    "metadata_service": {
        "description": "Genres, people catalogs, and AI enrichment storage",
        "framework": "FastAPI",
        "database": "MongoDB",
        "endpoints": ["/genres", "/people", "/movies/{movie_id}/analysis"],
    },
    "crawler_service": {
        "description": "Web crawl orchestration and worker queue",
        "framework": "FastAPI",
        "database": "RabbitMQ",
        "endpoints": ["/crawl", "/crawl/batch"],
    },
    "data_platform_service": {
        "description": "TMDB ingestion, controlled seeding, health checks",
        "framework": "FastAPI",
        "database": "Postgres + MySQL + Mongo + Redis",
        "endpoints": ["/ingest/tmdb/movies", "/seed/users", "/healthz"],
    },
    "ai_service": {
        "description": "MovieVerse AI inference + pipelines",
        "framework": "FastAPI",
        "database": "Model registry + feature store",
        "endpoints": ["/recommendations", "/summarize", "/genres/classify"],
    },
}
