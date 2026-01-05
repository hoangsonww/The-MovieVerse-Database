# MovieVerse AI Runbook

## Health Checks

- API health: `GET /healthz`
- Metrics: `GET /metrics`

## Operational Tasks

### Sync Models from MLflow

```bash
python -m movieverse_ai.pipelines.sync_models
```

### Generate Drift Report

```bash
python -m movieverse_ai.monitoring.drift_monitor
```

### Materialize Features

```bash
python -m movieverse_ai.pipelines.materialize_features
```

## Troubleshooting

- Missing model artifacts: run `sync_models` or re-train the pipelines.
- Kafka ingestion lag: verify broker connectivity and consumer group offsets.
- MLflow artifacts missing: check `MOVIEVERSE_AI_S3_*` and MLflow bucket permissions.
