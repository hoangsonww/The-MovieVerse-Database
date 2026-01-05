FROM python:3.11-slim

WORKDIR /opt/movieverse-ai

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY MovieVerse-AI/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY MovieVerse-AI/movieverse_ai ./movieverse_ai
COPY MovieVerse-AI/feature_repo ./feature_repo

RUN mkdir -p /opt/movieverse-ai/models /opt/movieverse-ai/index

EXPOSE 9000

CMD ["uvicorn", "movieverse_ai.api.main:app", "--host", "0.0.0.0", "--port", "9000"]
