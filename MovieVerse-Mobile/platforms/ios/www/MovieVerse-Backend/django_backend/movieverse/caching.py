from django.core.cache import cache

from .service_clients import list_movies


def get_top_movies(limit: int = 10):
    cached = cache.get("top_movies")
    if cached is not None:
        return cached

    movies = list_movies({"limit": max(limit * 5, 50)})
    sorted_movies = sorted(
        movies,
        key=lambda item: (item.get("rating") or 0.0, item.get("popularity") or 0.0),
        reverse=True,
    )[:limit]
    cache.set("top_movies", sorted_movies, timeout=3600)
    return sorted_movies
