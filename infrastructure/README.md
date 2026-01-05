# MovieVerse Infrastructure Stack

This directory contains production-grade infrastructure assets for running the MovieVerse microservices stack with a focus on event-driven architecture, load balancing, and observability.

## Contents

- nginx/
  - microservices.conf: Edge load balancer and API routing configuration.
- observability/
  - prometheus.yml: Metrics scrape configuration for microservices.
  - loki.yml: Log aggregation configuration (optional for Kubernetes or standalone Loki).
- elk/
  - elasticsearch.yml: Single-node Elasticsearch config for log indexing.
  - logstash.conf: Logstash pipeline ingesting Filebeat logs.
  - filebeat.yml: Docker log harvesting and enrichment.

## Local Usage

Bring up the microservices stack:

```bash
docker compose -f docker-compose.microservices.yml up -d
```

Add observability services:

```bash
docker compose -f docker-compose.microservices.yml -f docker-compose.observability.yml up -d
```

ELK endpoints (local):

- Elasticsearch: `http://localhost:9201`
- Kibana: `http://localhost:5601`

## Notes

- Service images (movieverse/*) are expected to be published by your CI pipeline.
- Update `infrastructure/nginx/microservices.conf` if you change service paths or ports.
- For production, deploy these components through the `kubernetes/` or `aws/` stacks.
