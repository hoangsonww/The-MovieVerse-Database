from __future__ import annotations

import requests

from .config import DatabaseConfig


class DataPlatformClient:
    def __init__(self, config: DatabaseConfig):
        self._base_url = config.data_platform_url.rstrip("/")
        self._seed_token = config.seed_token
        self._timeout = config.http_timeout_seconds
        self._session = requests.Session()

    def _url(self, path: str) -> str:
        if not path.startswith("/"):
            path = f"/{path}"
        return f"{self._base_url}{path}"

    def _headers(self, require_seed: bool) -> dict[str, str]:
        if not require_seed:
            return {}
        if not self._seed_token:
            raise RuntimeError("MOVIEVERSE_SEED_TOKEN must be set to call seed endpoints.")
        return {"X-Seed-Token": self._seed_token}

    def get(self, path: str) -> dict:
        response = self._session.get(self._url(path), timeout=self._timeout)
        response.raise_for_status()
        return response.json()

    def post(self, path: str, payload: dict, require_seed: bool = False) -> dict:
        response = self._session.post(
            self._url(path),
            json=payload,
            timeout=self._timeout,
            headers=self._headers(require_seed),
        )
        response.raise_for_status()
        return response.json()

    def close(self) -> None:
        self._session.close()
