from __future__ import annotations

import argparse
import json
import logging
import sys

from .client import DataPlatformClient
from .config import load_config
from .operations import seed_users


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s %(levelname)s %(message)s")


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed user data through the data platform.")
    parser.add_argument("--count", type=int, default=50, help="Number of users to seed.")
    parser.add_argument(
        "--password",
        default=None,
        help="Password for seeded users (overrides MOVIEVERSE_SEED_USER_PASSWORD).",
    )
    parser.add_argument("--json", action="store_true", help="Output raw JSON without indentation.")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging.")
    args = parser.parse_args()

    _configure_logging(args.verbose)
    config = load_config()
    password = args.password or config.seed_user_password
    if not password:
        logging.error("seed_user_password_missing")
        return 1

    client = DataPlatformClient(config)
    try:
        payload = seed_users(client, count=args.count, password=password)
    except Exception as exc:
        logging.error("seed_users_failed", exc_info=exc)
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
