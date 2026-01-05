from __future__ import annotations

import argparse
import json
import logging
import sys

from .client import DataPlatformClient
from .config import load_config
from .operations import healthcheck


def _configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format="%(asctime)s %(levelname)s %(message)s")


def main() -> int:
    parser = argparse.ArgumentParser(description="MovieVerse data platform health check.")
    parser.add_argument("--json", action="store_true", help="Output raw JSON without indentation.")
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging.")
    args = parser.parse_args()

    _configure_logging(args.verbose)
    client = DataPlatformClient(load_config())
    try:
        payload = healthcheck(client)
    except Exception as exc:
        logging.error("healthcheck_failed", exc_info=exc)
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
