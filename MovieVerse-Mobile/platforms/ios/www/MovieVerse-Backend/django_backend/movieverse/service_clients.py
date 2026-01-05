from __future__ import annotations

import os
from typing import Any

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

MOVIE_SERVICE_URL = os.getenv("MOVIEVERSE_MOVIE_SERVICE_URL", "http://localhost:8080")
REVIEW_SERVICE_URL = os.getenv("MOVIEVERSE_REVIEW_SERVICE_URL", "http://localhost:8080")
USER_SERVICE_URL = os.getenv("MOVIEVERSE_USER_SERVICE_URL", "http://localhost:8080")
METADATA_SERVICE_URL = os.getenv("MOVIEVERSE_METADATA_SERVICE_URL", "http://localhost:8080")
SEARCH_SERVICE_URL = os.getenv("MOVIEVERSE_SEARCH_SERVICE_URL", "http://localhost:8080")
RECOMMENDATION_SERVICE_URL = os.getenv("MOVIEVERSE_RECOMMENDATION_SERVICE_URL", "http://localhost:8080")
NOTIFICATION_SERVICE_URL = os.getenv("MOVIEVERSE_NOTIFICATION_SERVICE_URL", "http://localhost:8080")
AUTH_SERVICE_URL = os.getenv("MOVIEVERSE_AUTH_SERVICE_URL", "http://localhost:8080")
CRAWLER_SERVICE_URL = os.getenv("MOVIEVERSE_CRAWLER_SERVICE_URL", "http://localhost:8080")

_SESSION = requests.Session()
_RETRY = Retry(
    total=3,
    connect=3,
    read=3,
    backoff_factor=0.3,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=("GET", "POST", "PUT", "DELETE", "PATCH"),
)
_ADAPTER = HTTPAdapter(max_retries=_RETRY, pool_connections=20, pool_maxsize=20)
_SESSION.mount("http://", _ADAPTER)
_SESSION.mount("https://", _ADAPTER)


def _headers(request=None, extra: dict | None = None) -> dict:
    headers: dict[str, str] = {}
    if request is not None:
        request_id = request.headers.get("X-Request-ID")
        if request_id:
            headers["X-Request-ID"] = request_id
        auth = request.headers.get("Authorization")
        if auth:
            headers["Authorization"] = auth
    if extra:
        headers.update(extra)
    return headers


def _request(
    method: str,
    url: str,
    request=None,
    params: dict | None = None,
    payload: dict | None = None,
    timeout: int = 15,
) -> Any:
    response = _SESSION.request(
        method,
        url,
        params=params,
        json=payload,
        timeout=timeout,
        headers=_headers(request),
    )
    response.raise_for_status()
    if response.content:
        return response.json()
    return None


def list_movies(params: dict | None = None, request=None) -> list[dict]:
    return _request("GET", f"{MOVIE_SERVICE_URL}/movies", request=request, params=params)


def get_movie(movie_id: int, request=None) -> dict:
    return _request("GET", f"{MOVIE_SERVICE_URL}/movies/{movie_id}", request=request)


def create_movie(payload: dict, request=None) -> dict:
    return _request("POST", f"{MOVIE_SERVICE_URL}/movies", request=request, payload=payload)


def update_movie(movie_id: int, payload: dict, request=None) -> dict:
    return _request("PUT", f"{MOVIE_SERVICE_URL}/movies/{movie_id}", request=request, payload=payload)


def list_reviews_for_movie(movie_id: int, limit: int = 50, request=None) -> list[dict]:
    return _request(
        "GET",
        f"{REVIEW_SERVICE_URL}/reviews/movies/{movie_id}",
        request=request,
        params={"limit": limit},
    )


def list_reviews_for_user(user_id: int, limit: int = 50, request=None) -> list[dict]:
    return _request(
        "GET",
        f"{REVIEW_SERVICE_URL}/reviews/users/{user_id}",
        request=request,
        params={"limit": limit},
    )


def create_review(payload: dict, request=None) -> dict:
    return _request("POST", f"{REVIEW_SERVICE_URL}/reviews", request=request, payload=payload)


def list_genres(limit: int = 50, q: str | None = None, request=None) -> dict:
    params: dict[str, Any] = {"limit": limit}
    if q:
        params["q"] = q
    return _request("GET", f"{METADATA_SERVICE_URL}/genres", request=request, params=params)


def get_genre(genre_id: int, request=None) -> dict:
    return _request("GET", f"{METADATA_SERVICE_URL}/genres/{genre_id}", request=request)


def list_people(limit: int = 50, q: str | None = None, department: str | None = None, request=None) -> dict:
    params: dict[str, Any] = {"limit": limit}
    if q:
        params["q"] = q
    if department:
        params["department"] = department
    return _request("GET", f"{METADATA_SERVICE_URL}/people", request=request, params=params)


def get_person(person_id: int, request=None) -> dict:
    return _request("GET", f"{METADATA_SERVICE_URL}/people/{person_id}", request=request)


def get_movie_analysis(movie_id: int, request=None) -> dict:
    return _request("GET", f"{METADATA_SERVICE_URL}/movies/{movie_id}/analysis", request=request)


def get_profile(user_id: int, request=None) -> dict:
    return _request("GET", f"{USER_SERVICE_URL}/profiles/{user_id}", request=request)


def create_profile(payload: dict, request=None) -> dict:
    return _request("POST", f"{USER_SERVICE_URL}/profiles", request=request, payload=payload)


def update_profile(user_id: int, payload: dict, request=None) -> dict:
    return _request("PUT", f"{USER_SERVICE_URL}/profiles/{user_id}", request=request, payload=payload)


def search_movies(query: str, limit: int = 20, request=None) -> list[dict]:
    response = _request(
        "POST",
        f"{SEARCH_SERVICE_URL}/search",
        request=request,
        payload={"query": query, "limit": limit},
    )
    return response.get("results", [])


def search_reviews(query: str, limit: int = 20, request=None) -> list[dict]:
    response = _request(
        "POST",
        f"{SEARCH_SERVICE_URL}/search/reviews",
        request=request,
        payload={"query": query, "limit": limit},
    )
    return response.get("results", [])


def get_recommendations(payload: dict, request=None) -> dict:
    return _request("POST", f"{RECOMMENDATION_SERVICE_URL}/recommendations", request=request, payload=payload)


def get_similar(payload: dict, request=None) -> dict:
    return _request("POST", f"{RECOMMENDATION_SERVICE_URL}/similar", request=request, payload=payload)


def notify_user(payload: dict, request=None) -> dict:
    return _request("POST", f"{NOTIFICATION_SERVICE_URL}/notify", request=request, payload=payload)


def list_notifications(user_id: int, limit: int = 50, request=None) -> list[dict]:
    return _request(
        "GET",
        f"{NOTIFICATION_SERVICE_URL}/notifications",
        request=request,
        params={"user_id": user_id, "limit": limit},
    )


def register_user(payload: dict, request=None) -> dict:
    return _request("POST", f"{AUTH_SERVICE_URL}/register", request=request, payload=payload)


def login_user(payload: dict, request=None) -> dict:
    return _request("POST", f"{AUTH_SERVICE_URL}/login", request=request, payload=payload)


def refresh_user_token(payload: dict, request=None) -> dict:
    return _request("POST", f"{AUTH_SERVICE_URL}/refresh", request=request, payload=payload)


def enqueue_crawl(payload: dict, request=None) -> dict:
    return _request("POST", f"{CRAWLER_SERVICE_URL}/crawl", request=request, payload=payload)
