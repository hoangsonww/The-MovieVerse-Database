from __future__ import annotations

import re

import httpx

from crawler.config import settings
from crawler.exceptions import DataFetchError, ParsingError
from crawler.models import CrawlJob


class TmdbSource:
    name = "tmdb"

    def _extract_movie_id(self, url: str) -> int | None:
        if url.startswith("tmdb:"):
            value = url.replace("tmdb:", "", 1)
            return int(value) if value.isdigit() else None
        match = re.search(r"/movie/(\\d+)", url)
        if match:
            return int(match.group(1))
        if url.isdigit():
            return int(url)
        return None

    def fetch(self, job: CrawlJob) -> dict:
        movie_id = self._extract_movie_id(job.url)
        if not movie_id:
            raise DataFetchError("TMDB movie id missing")
        if not settings.tmdb_api_key:
            raise DataFetchError("TMDB API key not configured")
        with httpx.Client(timeout=settings.crawler_timeout_seconds) as client:
            response = client.get(
                f"{settings.tmdb_base_url}/movie/{movie_id}",
                params={
                    "api_key": settings.tmdb_api_key,
                    "append_to_response": "credits,external_ids",
                },
            )
            response.raise_for_status()
            payload = response.json()
            payload["movie_id"] = movie_id
            return payload

    def parse(self, raw: dict) -> dict:
        if not raw.get("title"):
            raise ParsingError("TMDB payload missing title")
        credits = raw.get("credits") or {}
        cast = [member.get("name") for member in credits.get("cast", []) if member.get("name")]
        director = ""
        for member in credits.get("crew", []):
            if member.get("job") == "Director":
                director = member.get("name") or ""
                break
        genres = [genre.get("name") for genre in raw.get("genres", []) if genre.get("name")]
        return {
            "name": raw.get("title"),
            "description": raw.get("overview") or "",
            "poster_url": f"https://image.tmdb.org/t/p/w500{raw.get('poster_path')}" if raw.get("poster_path") else "",
            "cast": cast,
            "director": director,
            "genres": genres,
            "duration": str(raw.get("runtime") or ""),
            "rating": raw.get("vote_average"),
            "release_date": raw.get("release_date") or "",
            "trailer_url": "",
            "imdb_url": "",
            "reviews": [],
            "similar_movies": [],
            "recommendations": [],
            "awards": "",
            "box_office": "",
            "budget": str(raw.get("budget") or ""),
            "company": "",
            "country": "",
            "language": raw.get("original_language") or "",
            "tagline": raw.get("tagline") or "",
            "website": raw.get("homepage") or "",
            "writers": [],
            "year": int(raw.get("release_date", "0000")[:4]) if raw.get("release_date") else 0,
            "id": raw.get("external_ids", {}).get("imdb_id") or "",
            "imdb_rating": raw.get("vote_average") or 0.0,
            "imdb_votes": raw.get("vote_count") or 0,
            "metascore": 0,
            "rotten_tomatoes_rating": 0,
            "rotten_tomatoes_reviews": 0,
            "rotten_tomatoes_fresh": 0,
            "tmdb_id": raw.get("movie_id"),
            "popularity": raw.get("popularity"),
        }
