from __future__ import annotations

import httpx

from movieverse_services.common.config import settings


class TmdbClient:
    def __init__(self) -> None:
        if not settings.tmdb_api_key:
            raise ValueError("TMDB API key is not configured")
        self.base_url = settings.tmdb_base_url.rstrip("/")
        self.api_key = settings.tmdb_api_key

    def _get(self, path: str, params: dict) -> dict:
        url = f"{self.base_url}/{path.lstrip('/')}"
        with httpx.Client(timeout=20.0) as client:
            response = client.get(url, params={"api_key": self.api_key, **params})
            response.raise_for_status()
            return response.json()

    def fetch_popular_movies(self, page: int, language: str | None, region: str | None) -> list[dict]:
        params: dict[str, str | int] = {"page": page}
        if language:
            params["language"] = language
        if region:
            params["region"] = region
        data = self._get("movie/popular", params)
        return data.get("results", [])

    def fetch_genres(self, language: str | None) -> list[dict]:
        params: dict[str, str] = {}
        if language:
            params["language"] = language
        data = self._get("genre/movie/list", params)
        return data.get("genres", [])

    def fetch_people(self, page: int, language: str | None) -> list[dict]:
        params: dict[str, str | int] = {"page": page}
        if language:
            params["language"] = language
        data = self._get("person/popular", params)
        return data.get("results", [])
