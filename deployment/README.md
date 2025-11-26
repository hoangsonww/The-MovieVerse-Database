# MovieVerse Deployment Infrastructure

This directory contains all deployment-related configurations, scripts, and utilities for the MovieVerse application.

## Directory Structure

```
deployment/
├── scripts/                    # Deployment automation scripts
│   ├── blue-green-switch.sh   # Blue-Green deployment traffic switching
│   ├── monitor-canary.py      # Canary deployment monitoring
│   ├── rollback.sh            # Automated rollback procedures
│   └── health-check.sh        # Comprehensive health checking
│
├── configs/                    # Configuration files
│   ├── prometheus-config.yml  # Prometheus monitoring configuration
│   ├── prometheus-rules.yml   # Prometheus alerting rules
│   ├── alertmanager-config.yml # Alertmanager configuration
│   ├── datadog-config.yml     # Datadog agent configuration
│   ├── task-definition-blue.json   # ECS Blue environment task definition
│   └── task-definition-green.json  # ECS Green environment task definition
│
└── README.md                   # This file
```

## Quick Start

### Prerequisites

Install required tools:
```bash
# AWS CLI
pip install awscli

# Python dependencies for monitoring scripts
pip install boto3 requests prometheus-client

# kubectl (for Kubernetes deployments)
# See: https://kubernetes.io/docs/tasks/tools/

# Make scripts executable
chmod +x deployment/scripts/*.sh
```

### Configuration

Set required environment variables:
```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=your-account-id
export ECS_CLUSTER=movieverse-prod-cluster
export K8S_NAMESPACE=movieverse
```

## Scripts

### blue-green-switch.sh

Switches traffic between blue and green environments.

**Usage:**
```bash
# Automatic detection and switch
./deployment/scripts/blue-green-switch.sh

# Switch to specific environment
./deployment/scripts/blue-green-switch.sh --target green

# Gradual traffic shift
./deployment/scripts/blue-green-switch.sh --target green --gradual
```

**Features:**
- Automatic active environment detection
- Health checks before switching
- Gradual traffic shifting option
- Automatic rollback on failure

### monitor-canary.py

Monitors canary deployment metrics and determines if rollout should proceed.

**Usage:**
```bash
# Monitor for 5 minutes with default thresholds
python3 deployment/scripts/monitor-canary.py --duration 300

# Custom thresholds
python3 deployment/scripts/monitor-canary.py \
  --duration 600 \
  --error-threshold 5.0 \
  --latency-threshold 500 \
  --service-name movieverse
```

**Monitored Metrics:**
- Error rate (5xx responses)
- P99 latency
- Comparison with stable deployment
- Health check status

**Exit Codes:**
- `0`: Metrics healthy, proceed with rollout
- `1`: Metrics unhealthy, rollback recommended

### rollback.sh

Automated rollback for different deployment strategies.

**Usage:**
```bash
# Rollback blue-green deployment
./deployment/scripts/rollback.sh --strategy blue-green

# Rollback canary deployment
./deployment/scripts/rollback.sh --strategy canary

# Rollback ECS rolling deployment
./deployment/scripts/rollback.sh --strategy ecs-rolling

# Rollback Kubernetes rolling deployment
./deployment/scripts/rollback.sh --strategy k8s-rolling
```

**Features:**
- Strategy-specific rollback logic
- Notification integration (Slack, email)
- Deployment markers in monitoring systems
- Comprehensive logging

### health-check.sh

Comprehensive health checking utility.

**Usage:**
```bash
# Basic HTTP health check
./deployment/scripts/health-check.sh \
  --url https://movie-verse.com \
  --type http

# API endpoint checks
./deployment/scripts/health-check.sh \
  --url https://movie-verse.com \
  --type api

# Comprehensive checks (HTTP, API, databases, SSL)
./deployment/scripts/health-check.sh \
  --url https://movie-verse.com \
  --type comprehensive
```

**Checks:**
- HTTP endpoint availability
- Response time
- API health
- Database connectivity
- SSL certificate validity

## Configuration Files

### Prometheus Configuration

**prometheus-config.yml**: Main Prometheus configuration
- Scrape configurations for MovieVerse services
- Kubernetes service discovery
- AWS CloudWatch integration
- Alert routing

**prometheus-rules.yml**: Alerting rules
- High error rate alerts
- High latency alerts
- Canary vs stable comparison
- Infrastructure alerts

### Alertmanager Configuration

**alertmanager-config.yml**: Alert routing and notification
- Slack integration
- PagerDuty integration
- Email notifications
- Alert grouping and deduplication

### Datadog Configuration

**datadog-config.yml**: Datadog agent configuration
- APM configuration
- Log collection
- Kubernetes integration
- Custom tags and metrics

### ECS Task Definitions

**task-definition-blue.json** / **task-definition-green.json**
- Container definitions
- Resource allocations
- Environment variables
- Health checks
- Secrets management

## Environment Variables

### Required Variables

```bash
# AWS Configuration
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=123456789012

# ECS Configuration
export ECS_CLUSTER=movieverse-prod-cluster
export ECS_SERVICE=movieverse-prod-service-blue

# Kubernetes Configuration
export K8S_NAMESPACE=movieverse
export KUBECONFIG=~/.kube/config

# Notification Configuration (Optional)
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
export NOTIFICATION_EMAIL=devops@movie-verse.com

# Monitoring Configuration (Optional)
export DATADOG_API_KEY=your-datadog-api-key
```

### Optional Variables

```bash
# Deployment Configuration
export DEPLOYMENT_STRATEGY=blue-green  # blue-green, canary, rolling
export TIMEOUT=30                       # Health check timeout in seconds
export MAX_RETRIES=3                    # Maximum retry attempts
export RETRY_DELAY=5                    # Delay between retries in seconds

# Traffic Configuration
export LISTENER_PORT=80                 # ALB listener port
export WAIT_TIME=60                     # Wait time between traffic shifts

# Monitoring Configuration
export ERROR_THRESHOLD=5.0              # Maximum error rate percentage
export LATENCY_THRESHOLD=500            # Maximum latency in milliseconds
```

## Integration with CI/CD

### Jenkins Integration

The scripts are designed to be called from Jenkins pipeline:

```groovy
stage('Deploy') {
    steps {
        script {
            sh './deployment/scripts/blue-green-switch.sh --target green'
        }
    }
}

stage('Monitor Canary') {
    steps {
        script {
            def result = sh(
                script: 'python3 deployment/scripts/monitor-canary.py --duration 300',
                returnStatus: true
            )
            if (result != 0) {
                error("Canary metrics unhealthy")
            }
        }
    }
}
```

### GitHub Actions Integration

```yaml
- name: Deploy Blue-Green
  run: |
    chmod +x deployment/scripts/blue-green-switch.sh
    ./deployment/scripts/blue-green-switch.sh --target green

- name: Health Check
  run: |
    chmod +x deployment/scripts/health-check.sh
    ./deployment/scripts/health-check.sh \
      --url https://movie-verse.com \
      --type comprehensive
```

## Monitoring Integration

### Prometheus

Deploy Prometheus with the provided configuration:

```bash
kubectl create configmap prometheus-config \
  --from-file=deployment/configs/prometheus-config.yml \
  -n monitoring

kubectl create configmap prometheus-rules \
  --from-file=deployment/configs/prometheus-rules.yml \
  -n monitoring
```

### Datadog

Deploy Datadog agent with configuration:

```bash
kubectl create configmap datadog-config \
  --from-file=deployment/configs/datadog-config.yml \
  -n movieverse
```

### Alertmanager

Deploy Alertmanager:

```bash
kubectl create configmap alertmanager-config \
  --from-file=deployment/configs/alertmanager-config.yml \
  -n monitoring
```

## Troubleshooting

### Script Execution Issues

**Permission Denied:**
```bash
chmod +x deployment/scripts/*.sh
```

**Python Module Not Found:**
```bash
pip install boto3 requests prometheus-client
```

### AWS Authentication Issues

```bash
# Configure AWS credentials
aws configure

# Or use environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key

# Or use IAM role (recommended in production)
```

### Health Check Failures

1. **Verify endpoint is accessible:**
   ```bash
   curl -v https://movie-verse.com/health
   ```

2. **Check security groups:**
   ```bash
   aws ec2 describe-security-groups --group-ids sg-xxx
   ```

3. **Review CloudWatch logs:**
   ```bash
   aws logs tail /ecs/movieverse-prod --follow
   ```

## Best Practices

1. **Always test in staging first**
2. **Run health checks before and after deployments**
3. **Monitor metrics during deployments**
4. **Have rollback plan ready**
5. **Document deployment changes**
6. **Use version tags for Docker images**
7. **Enable deployment notifications**
8. **Review logs after deployments**

## Support

- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues
- **Slack**: #movieverse-deployments
- **Email**: devops@movie-verse.com

## Contributing

When adding new scripts or configurations:

1. Follow existing naming conventions
2. Add comprehensive comments
3. Update this README
4. Test thoroughly in staging
5. Document in deployment guide

## License

See LICENSE.md in project root.
