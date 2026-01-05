from __future__ import annotations

from crawler.models import CrawlJob
from crawler.parser import parse_movie_data
from crawler.scraper import HttpFetcher


class HtmlSource:
    name = "html"

    def __init__(self) -> None:
        self.fetcher = HttpFetcher()

    def fetch(self, job: CrawlJob) -> str:
        return self.fetcher.fetch(job.url)

    def parse(self, raw: str) -> dict:
        return parse_movie_data(raw)
