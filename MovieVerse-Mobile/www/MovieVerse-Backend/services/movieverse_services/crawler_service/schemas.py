from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class CrawlRequest(BaseModel):
    url: str
    source: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: int = Field(default=5, ge=1, le=10)


class CrawlBatchRequest(BaseModel):
    urls: List[str]
    source: Optional[str] = None
    tags: Optional[List[str]] = None
    priority: int = Field(default=5, ge=1, le=10)


class CrawlResponse(BaseModel):
    job_id: str
    url: str
    status: str = "queued"
