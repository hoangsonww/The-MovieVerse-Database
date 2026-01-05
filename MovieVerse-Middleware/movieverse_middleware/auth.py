from __future__ import annotations

from jose import jwt

from movieverse_middleware.config import settings


def verify_jwt(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
