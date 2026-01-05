from __future__ import annotations

from pydantic import BaseModel, Field


class ReindexRequest(BaseModel):
    limit: int | None = Field(default=None, ge=1, le=100000)
