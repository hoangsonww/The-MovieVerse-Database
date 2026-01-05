FROM python:3.11-slim

ARG SERVICE_MODULE

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SERVICE_MODULE=${SERVICE_MODULE} \
    PYTHONPATH=/app \
    UVICORN_WORKERS=2 \
    UVICORN_TIMEOUT_KEEP_ALIVE=5

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY MovieVerse-Backend/services/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY MovieVerse-Backend/services/movieverse_services /app/movieverse_services
COPY MovieVerse-Backend/crawler /app/crawler
COPY MovieVerse-Backend/databases /app/databases
COPY MovieVerse-Middleware/movieverse_middleware /app/movieverse_middleware

EXPOSE 8000

CMD ["/bin/sh", "-c", "uvicorn ${SERVICE_MODULE}:app --host 0.0.0.0 --port 8000 --workers ${UVICORN_WORKERS} --proxy-headers --forwarded-allow-ips '*' --timeout-keep-alive ${UVICORN_TIMEOUT_KEEP_ALIVE}"]
