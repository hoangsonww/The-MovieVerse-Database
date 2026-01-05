from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol
from urllib.parse import urlparse

from crawler.models import CrawlJob
from crawler.sources.html import HtmlSource
from crawler.sources.tmdb import TmdbSource


class Source(Protocol):
    name: str

    def fetch(self, job: CrawlJob):
        ...

    def parse(self, raw):
        ...


@dataclass
class SourceRegistry:
    def __post_init__(self) -> None:
        self._sources: dict[str, Source] = {
            "html": HtmlSource(),
            "tmdb": TmdbSource(),
        }

    def resolve(self, job: CrawlJob) -> Source:
        if job.source and job.source in self._sources:
            return self._sources[job.source]
        url = job.url.lower()
        if url.startswith("tmdb:") or "themoviedb.org" in url:
            return self._sources["tmdb"]
        hostname = urlparse(url).hostname or ""
        if hostname:
            return self._sources.get(hostname, self._sources["html"])
        return self._sources["html"]


source_registry = SourceRegistry()
