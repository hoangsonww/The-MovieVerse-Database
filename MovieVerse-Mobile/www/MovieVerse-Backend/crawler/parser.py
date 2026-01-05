from __future__ import annotations

import json

from bs4 import BeautifulSoup

from crawler.exceptions import ParsingError


def _text(tag, default: str | None = None) -> str | None:
    if not tag:
        return default
    return tag.text.strip()


def _attr(tag, name: str, default: str | None = None) -> str | None:
    if not tag:
        return default
    return tag.get(name, default)


def _float(value: str | None) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except ValueError:
        return None


def _int(value: str | None) -> int | None:
    if value is None:
        return None
    try:
        return int(value.replace(",", ""))
    except ValueError:
        return None


def _extract_json_ld(soup: BeautifulSoup) -> dict | None:
    script = soup.find("script", type="application/ld+json")
    if not script or not script.text:
        return None
    try:
        payload = json.loads(script.text)
    except json.JSONDecodeError:
        return None
    if isinstance(payload, list):
        payload = next((item for item in payload if isinstance(item, dict) and item.get("@type") == "Movie"), None)
    if isinstance(payload, dict) and payload.get("@type") == "Movie":
        return payload
    return None


def parse_movie_data(html_content: str) -> dict:
    soup = BeautifulSoup(html_content, "html.parser")
    json_ld = _extract_json_ld(soup)
    if json_ld:
        return {
            "name": json_ld.get("name") or "",
            "description": json_ld.get("description") or "",
            "poster_url": json_ld.get("image") or "",
            "cast": json_ld.get("actor") or [],
            "director": json_ld.get("director") or "",
            "genres": json_ld.get("genre") or [],
            "duration": json_ld.get("duration") or "",
            "rating": _float(json_ld.get("aggregateRating", {}).get("ratingValue")),
            "release_date": json_ld.get("datePublished") or "",
            "trailer_url": json_ld.get("trailer", {}).get("url") if isinstance(json_ld.get("trailer"), dict) else "",
            "imdb_url": json_ld.get("sameAs") or "",
            "reviews": [],
            "similar_movies": [],
            "recommendations": [],
            "awards": "",
            "box_office": "",
            "budget": "",
            "company": "",
            "country": "",
            "language": "",
            "tagline": "",
            "website": json_ld.get("url") or "",
            "writers": json_ld.get("author") or [],
            "year": _int((json_ld.get("datePublished") or "")[:4]) or 0,
            "id": json_ld.get("@id") or "",
            "imdb_rating": _float(json_ld.get("aggregateRating", {}).get("ratingValue")) or 0.0,
            "imdb_votes": _int(json_ld.get("aggregateRating", {}).get("ratingCount")) or 0,
            "metascore": 0,
            "rotten_tomatoes_rating": 0,
            "rotten_tomatoes_reviews": 0,
            "rotten_tomatoes_fresh": 0,
        }

    title = _text(soup.find("h1", class_="movie-title"))
    if not title:
        raise ParsingError("Missing movie title")

    movie_data = {
        "name": title,
        "description": _text(soup.find("div", class_="movie-description"), ""),
        "poster_url": _attr(soup.find("img", class_="movie-poster"), "src", ""),
        "cast": [cast.text.strip() for cast in soup.find_all("div", class_="movie-cast-member")],
        "director": _text(soup.find("div", class_="movie-director"), ""),
        "genres": [genre.text.strip() for genre in soup.find_all("span", class_="movie-genre")],
        "duration": _text(soup.find("div", class_="movie-duration"), ""),
        "rating": _float(_text(soup.find("span", class_="movie-rating"))),
        "release_date": _text(soup.find("div", class_="movie-release-date"), ""),
        "trailer_url": _attr(soup.find("a", class_="movie-trailer"), "href", ""),
        "imdb_url": _attr(soup.find("a", class_="movie-imdb"), "href", ""),
        "rotten_tomatoes_url": _attr(soup.find("a", class_="movie-rotten-tomatoes"), "href", ""),
        "metacritic_url": _attr(soup.find("a", class_="movie-metacritic"), "href", ""),
        "reviews": [
            {
                "author": _text(review.find("div", class_="review-author"), ""),
                "content": _text(review.find("div", class_="review-content"), ""),
                "rating": _float(_text(review.find("span", class_="review-rating"))) or 0.0,
            }
            for review in soup.find_all("div", class_="movie-review")
        ],
        "similar_movies": [
            {
                "name": _text(movie.find("h2", class_="movie-title"), ""),
                "poster_url": _attr(movie.find("img", class_="movie-poster"), "src", ""),
                "rating": _float(_text(movie.find("span", class_="movie-rating"))) or 0.0,
            }
            for movie in soup.find_all("div", class_="movie-similar")
        ],
        "recommendations": [
            {
                "name": _text(movie.find("h2", class_="movie-title"), ""),
                "poster_url": _attr(movie.find("img", class_="movie-poster"), "src", ""),
                "rating": _float(_text(movie.find("span", class_="movie-rating"))) or 0.0,
            }
            for movie in soup.find_all("div", class_="movie-recommendation")
        ],
        "awards": _text(soup.find("div", class_="movie-awards"), ""),
        "box_office": _text(soup.find("div", class_="movie-boxoffice"), ""),
        "budget": _text(soup.find("div", class_="movie-budget"), ""),
        "company": _text(soup.find("div", class_="movie-company"), ""),
        "country": _text(soup.find("div", class_="movie-country"), ""),
        "language": _text(soup.find("div", class_="movie-language"), ""),
        "tagline": _text(soup.find("div", class_="movie-tagline"), ""),
        "website": _text(soup.find("div", class_="movie-website"), ""),
        "writers": [writer.text.strip() for writer in soup.find_all("div", class_="movie-writer")],
        "year": _int(_text(soup.find("div", class_="movie-year"))) or 0,
        "id": "tt" + (_text(soup.find("span", class_="movie-imdb-id"), "") or ""),
        "imdb_rating": _float(_text(soup.find("span", class_="movie-imdb-rating"))) or 0.0,
        "imdb_votes": _int(_text(soup.find("span", class_="movie-imdb-votes"))) or 0,
        "metascore": _int(_text(soup.find("span", class_="movie-metascore"))) or 0,
        "rotten_tomatoes_rating": _int(
            (_text(soup.find("span", class_="movie-rotten-tomatoes-rating")) or "").replace("%", "")
        )
        or 0,
        "rotten_tomatoes_reviews": _int(
            (_text(soup.find("span", class_="movie-rotten-tomatoes-reviews")) or "").replace(",", "")
        )
        or 0,
        "rotten_tomatoes_fresh": _int(
            (_text(soup.find("span", class_="movie-rotten-tomatoes-fresh")) or "").replace("%", "")
        )
        or 0,
    }
    return movie_data
