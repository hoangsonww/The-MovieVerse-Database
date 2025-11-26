# MovieVerse Deployment Guide

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Deployment Strategies](#deployment-strategies)
  - [Blue-Green Deployment](#blue-green-deployment)
  - [Canary Deployment](#canary-deployment)
  - [Rolling Deployment](#rolling-deployment)
- [Infrastructure Setup](#infrastructure-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Observability](#monitoring-and-observability)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

This document provides comprehensive guidance for deploying the MovieVerse application using production-ready deployment strategies including Blue-Green, Canary, and Rolling deployments.

### Key Features
- **Zero-downtime deployments** using Blue-Green strategy
- **Progressive rollouts** using Canary deployments with automated monitoring
- **Automated rollback** on deployment failures
- **Comprehensive monitoring** with Prometheus, Datadog, and CloudWatch
- **Infrastructure as Code** using CloudFormation and Kubernetes manifests

## Architecture

### High-Level Architecture

```mermaid
flowchart TB
    Internet[Internet]
    ALB[Application Load Balancer]
    TG_Blue[Target Group Blue<br/>(Production)]
    TG_Green[Target Group Green<br/>(Staging)]
    ECS_Blue[ECS Tasks<br/>(Blue Env)]
    ECS_Green[ECS Tasks<br/>(Green Env)]

    Internet --> ALB
    ALB --> TG_Blue
    ALB --> TG_Green
    TG_Blue --> ECS_Blue
    TG_Green --> ECS_Green

    classDef blue fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef green fill:#50C878,stroke:#2E7D4E,color:#fff
    class TG_Blue,ECS_Blue blue
    class TG_Green,ECS_Green green
```

### Deployment Infrastructure

- **AWS ECS Fargate**: Container orchestration
- **Application Load Balancer**: Traffic distribution
- **AWS CodeDeploy**: Blue-Green deployment automation
- **Amazon ECR**: Container registry
- **CloudWatch**: Metrics and logging
- **Prometheus**: Application metrics
- **Datadog**: APM and monitoring

## Prerequisites

### Required Tools
- AWS CLI v2.x
- Docker 20.x+
- kubectl 1.28+
- Jenkins 2.x
- Python 3.9+
- Bash 4.x+

### AWS Resources
- VPC with public and private subnets
- ECS Cluster
- ECR Repository
- IAM Roles and Policies
- Load Balancer and Target Groups
- CloudWatch Log Groups

### Environment Variables
```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=your-account-id
export CLUSTER_NAME=movieverse-prod-cluster
export ECR_REPOSITORY=movieverse
```

## Deployment Strategies

### Blue-Green Deployment

Blue-Green deployment maintains two identical production environments (Blue and Green). Traffic is switched from one to the other after the new version is verified.

#### Benefits
- Zero-downtime deployments
- Instant rollback capability
- Full environment validation before traffic switch
- Simple to understand and implement

#### Process

1. **Deploy to Inactive Environment**
   ```bash
   # Deploy to green environment (assuming blue is active)
   aws ecs update-service \
     --cluster movieverse-prod-cluster \
     --service movieverse-prod-service-green \
     --task-definition movieverse-prod-task-green \
     --force-new-deployment
   ```

2. **Wait for Deployment to Stabilize**
   ```bash
   aws ecs wait services-stable \
     --cluster movieverse-prod-cluster \
     --services movieverse-prod-service-green
   ```

3. **Run Smoke Tests**
   ```bash
   ./deployment/scripts/health-check.sh \
     --url http://green.movie-verse.com \
     --type comprehensive
   ```

4. **Switch Traffic**
   ```bash
   ./deployment/scripts/blue-green-switch.sh --target green
   ```

5. **Monitor New Environment**
   - Check error rates in CloudWatch
   - Monitor response times in Datadog
   - Review application logs

6. **Rollback if Needed**
   ```bash
   ./deployment/scripts/rollback.sh --strategy blue-green
   ```

#### Using Jenkins

```groovy
// In Jenkins pipeline
pipeline {
    stages {
        stage('Deploy') {
            steps {
                script {
                    build job: 'movieverse-deploy',
                        parameters: [
                            string(name: 'DEPLOYMENT_STRATEGY', value: 'blue-green'),
                            string(name: 'ENVIRONMENT', value: 'production')
                        ]
                }
            }
        }
    }
}
```

### Canary Deployment

Canary deployment gradually rolls out changes to a small subset of users before rolling out to the entire infrastructure.

#### Benefits
- Progressive rollout with early issue detection
- Automated monitoring and rollback
- Minimal blast radius
- Real-world testing with production traffic

#### Process

1. **Deploy Canary Version**
   ```bash
   kubectl set image deployment/movieverse-canary \
     movieverse-app=123456789.dkr.ecr.us-east-1.amazonaws.com/movieverse:v2.0.0 \
     -n movieverse
   ```

2. **Route 10% Traffic to Canary**
   ```bash
   kubectl patch ingress movieverse-canary \
     -n movieverse \
     --type=json \
     -p='[{"op": "replace", "path": "/metadata/annotations/nginx.ingress.kubernetes.io~1canary-weight", "value": "10"}]'
   ```

3. **Monitor Canary Metrics**
   ```bash
   python3 deployment/scripts/monitor-canary.py \
     --duration 300 \
     --error-threshold 5 \
     --latency-threshold 500
   ```

4. **Gradually Increase Traffic** (if metrics are healthy)
   - 10% → 25% → 50% → 75% → 100%
   - Monitor at each stage for 2-5 minutes

5. **Promote Canary to Stable**
   ```bash
   kubectl set image deployment/movieverse-stable \
     movieverse-app=123456789.dkr.ecr.us-east-1.amazonaws.com/movieverse:v2.0.0 \
     -n movieverse
   ```

#### Using Flagger (Automated Canary)

Flagger automates the canary deployment process:

```yaml
apiVersion: flagger.app/v1beta1
kind: Canary
metadata:
  name: movieverse
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: movieverse-stable
  analysis:
    interval: 1m
    threshold: 5
    maxWeight: 50
    stepWeight: 10
```

### Rolling Deployment

Rolling deployment gradually replaces instances of the previous version with the new version.

#### Benefits
- Simple to implement
- Resource efficient (no duplicate environments)
- Gradual rollout

#### Process

1. **Update ECS Service**
   ```bash
   aws ecs update-service \
     --cluster movieverse-prod-cluster \
     --service movieverse-prod-service-blue \
     --force-new-deployment \
     --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"
   ```

2. **Monitor Deployment**
   ```bash
   aws ecs wait services-stable \
     --cluster movieverse-prod-cluster \
     --services movieverse-prod-service-blue
   ```

## Infrastructure Setup

### 1. Deploy VPC Infrastructure

```bash
aws cloudformation create-stack \
  --stack-name movieverse-vpc \
  --template-body file://aws/cloudformation-vpc.yml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=movieverse-prod
```

### 2. Create ECR Repository

```bash
aws cloudformation create-stack \
  --stack-name movieverse-ecr \
  --template-body file://aws/cloudformation-ecr.yml \
  --parameters ParameterKey=RepositoryName,ParameterValue=movieverse
```

### 3. Deploy ECS Cluster

```bash
aws cloudformation create-stack \
  --stack-name movieverse-ecs \
  --template-body file://aws/cloudformation-ecs-cluster.yml \
  --parameters \
    ParameterKey=EnvironmentName,ParameterValue=movieverse-prod \
    ParameterKey=DesiredCount,ParameterValue=3 \
  --capabilities CAPABILITY_NAMED_IAM
```

### 4. Setup Kubernetes Resources (if using EKS)

```bash
# Create namespace
kubectl apply -f kubernetes/base/namespace.yml

# Create service account and RBAC
kubectl apply -f kubernetes/base/serviceaccount.yml

# Create ConfigMap and Secrets
kubectl apply -f kubernetes/base/configmap.yml
kubectl apply -f kubernetes/base/secrets.yml

# Deploy blue-green resources
kubectl apply -f kubernetes/blue-green/

# Or deploy canary resources
kubectl apply -f kubernetes/canary/
```

## CI/CD Pipeline

### Jenkins Pipeline Configuration

The Jenkinsfile supports multiple deployment strategies:

```bash
# Trigger blue-green deployment
curl -X POST http://jenkins.company.com/job/movieverse-deploy/buildWithParameters \
  -d "DEPLOYMENT_STRATEGY=blue-green" \
  -d "ENVIRONMENT=production" \
  -d "IMAGE_TAG=v2.0.0"

# Trigger canary deployment
curl -X POST http://jenkins.company.com/job/movieverse-deploy/buildWithParameters \
  -d "DEPLOYMENT_STRATEGY=canary" \
  -d "ENVIRONMENT=production" \
  -d "IMAGE_TAG=v2.0.0"
```

### Pipeline Stages

1. **Initialize**: Setup environment and send notifications
2. **Checkout**: Clone repository
3. **Install Dependencies**: Install Node.js packages
4. **Run Tests**: Execute unit tests, linting, and security scans
5. **Build Docker Image**: Create container image
6. **Scan Docker Image**: Security vulnerability scanning
7. **Push to ECR**: Upload image to container registry
8. **Deploy**: Execute chosen deployment strategy
9. **Smoke Tests**: Verify deployment health
10. **Approval** (Production only): Manual approval gate
11. **Complete Deployment**: Finalize deployment

## Monitoring and Observability

### Prometheus Metrics

Key metrics to monitor:
- `http_requests_total`: Total HTTP requests
- `http_request_duration_seconds`: Request latency
- `container_memory_usage_bytes`: Memory usage
- `container_cpu_usage_seconds_total`: CPU usage

### CloudWatch Dashboards

Access CloudWatch dashboards:
```bash
aws cloudwatch get-dashboard \
  --dashboard-name MovieVerse-Production
```

### Datadog Integration

Datadog provides:
- APM traces
- Log aggregation
- Custom metrics
- Deployment markers

### Alert Rules

Alerts are configured in Prometheus for:
- High error rates (>5%)
- High latency (P99 >1s)
- Service downtime
- Memory/CPU usage >90%
- Pod restarts

## Rollback Procedures

### Automatic Rollback

The deployment pipeline automatically rolls back on:
- Failed health checks
- High error rates during canary deployment
- ECS deployment circuit breaker triggers

### Manual Rollback

```bash
# Rollback blue-green deployment
./deployment/scripts/rollback.sh --strategy blue-green

# Rollback canary deployment
./deployment/scripts/rollback.sh --strategy canary

# Rollback ECS rolling deployment
./deployment/scripts/rollback.sh --strategy ecs-rolling
```

### Rollback Verification

After rollback:
1. Check service health: `./deployment/scripts/health-check.sh --url https://movie-verse.com`
2. Verify metrics in Datadog
3. Check error rates in CloudWatch
4. Review application logs

## Troubleshooting

### Common Issues

#### Deployment Stuck

```bash
# Check ECS service events
aws ecs describe-services \
  --cluster movieverse-prod-cluster \
  --services movieverse-prod-service-blue \
  --query 'services[0].events[0:10]'

# Check task definition
aws ecs describe-task-definition \
  --task-definition movieverse-prod-task-blue
```

#### High Error Rates

1. Check application logs:
   ```bash
   aws logs tail /ecs/movieverse-prod --follow
   ```

2. Review Datadog APM traces

3. Check database connectivity

#### Container Fails to Start

```bash
# Get task details
aws ecs describe-tasks \
  --cluster movieverse-prod-cluster \
  --tasks <task-id>

# Check CloudWatch logs
aws logs get-log-events \
  --log-group-name /ecs/movieverse-prod \
  --log-stream-name <stream-name>
```

### Health Check Failures

```bash
# Manual health check
curl -v http://movie-verse.com/health

# Detailed health check
./deployment/scripts/health-check.sh \
  --url https://movie-verse.com \
  --type comprehensive
```

### Support

For additional support:
- Slack: #movieverse-deployments
- Email: devops@movie-verse.com
- On-call: PagerDuty rotation

## Best Practices

1. **Always run smoke tests** before completing deployments
2. **Monitor metrics** for at least 15 minutes after deployment
3. **Use feature flags** for high-risk changes
4. **Document deployment changes** in changelog
5. **Communicate** with team before production deployments
6. **Have rollback plan** ready before deploying
7. **Test in staging** environment first
8. **Use automated monitoring** for canary deployments
9. **Keep deployment windows** during low-traffic periods
10. **Review deployment metrics** in post-deployment review

## Additional Resources

- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [Kubernetes Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Blue-Green Deployment Pattern](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Canary Deployment Pattern](https://martinfowler.com/bliki/CanaryRelease.html)
