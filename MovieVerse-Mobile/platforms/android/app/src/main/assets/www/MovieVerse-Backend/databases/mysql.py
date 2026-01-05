from __future__ import annotations

import argparse
import json
import logging
import sys

from .client import DataPlatformClient
from .config import load_config
from .operations import seed_reviews


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s %(levelname)s %(message)s")


def _parse_ids(value: str | None) -> list[int] | None:
    if not value:
        return None
    return [int(item.strip()) for item in value.split(",") if item.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed review data through the data platform.")
    parser.add_argument("--count", type=int, default=100, help="Number of reviews to seed.")
    parser.add_argument("--min-rating", type=int, default=1, help="Minimum rating.")
    parser.add_argument("--max-rating", type=int, default=5, help="Maximum rating.")
    parser.add_argument("--user-ids", default=None, help="Comma-separated user IDs to seed.")
    parser.add_argument("--movie-ids", default=None, help="Comma-separated movie IDs to seed.")
    parser.add_argument("--json", action="store_true", help="Output raw JSON without indentation.")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging.")
    args = parser.parse_args()

    _configure_logging(args.verbose)
    client = DataPlatformClient(load_config())
    try:
        payload = seed_reviews(
            client,
            count=args.count,
            min_rating=args.min_rating,
            max_rating=args.max_rating,
            user_ids=_parse_ids(args.user_ids),
            movie_ids=_parse_ids(args.movie_ids),
        )
    except Exception as exc:
        logging.error("seed_reviews_failed", exc_info=exc)
        return 1
    finally:
        client.close()

    if args.json:
        print(json.dumps(payload))
    else:
        print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
