from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class NotificationCreate(BaseModel):
    user_id: int
    message: str = Field(min_length=1, max_length=500)


class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    message: str
    status: str
    created_at: datetime
