# MovieVerse APIs

This directory documents and tests the production API surface for the MovieVerse microservices stack. The entrypoint is the Nginx edge gateway (`http://localhost:8080`) which fronts all services.

## Files

- `movieverse-openapi.yaml`: Unified OpenAPI spec for the edge gateway.
- `api.http`: Curated HTTP requests for day-to-day testing.
- `api_test_suite.py`: Integration smoke tests targeting the gateway.
- `http-client.env.json`: Shared environment variables for the HTTP client.
- `http-client.private.env.json`: Local-only secrets (tokens, API keys).
- `sample_initial_api_response.json`: Example response payload from the gateway.

## Local quick start

```bash
docker compose -f docker-compose.microservices.yml up -d
python MovieVerse-Backend/APIs/api_test_suite.py
```

## Notes

- Use `MOVIEVERSE_API_BASE_URL` to override the default gateway URL.
- Auth flows live under `/auth/*` and return access/refresh tokens.
- Search is accessed via `/search` (movies) and `/search/reviews`.
- The crawler expects TMDB support; set `MOVIEVERSE_TMDB_API_KEY` for ingestion.
