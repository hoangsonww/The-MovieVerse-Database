from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from movieverse_services.common.config import settings

Base = declarative_base()


def _engine_options() -> dict:
    return {
        "pool_pre_ping": True,
        "pool_size": settings.db_pool_size,
        "max_overflow": settings.db_max_overflow,
        "pool_recycle": settings.db_pool_recycle_seconds,
    }


def postgres_engine():
    return create_engine(settings.postgres_dsn, **_engine_options())


def mysql_engine():
    return create_engine(settings.mysql_dsn, **_engine_options())


def session_factory(engine):
    return sessionmaker(bind=engine, autocommit=False, autoflush=False)


def maybe_create_schema(engine) -> None:
    if settings.auto_migrate:
        Base.metadata.create_all(bind=engine)
