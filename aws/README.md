# MovieVerse AWS Infrastructure

This directory contains production-ready CloudFormation templates for deploying the MovieVerse microservices stack on AWS.

## Templates

- cloudformation-vpc.yml
  - VPC, subnets, routing, NAT gateways.
- cloudformation-ecr.yml
  - ECR repositories for MovieVerse services.
- cloudformation-ecs-cluster.yml
  - ECS Fargate cluster with ALB and blue-green support.
- cloudformation-eks.yml
  - EKS cluster and managed node groups for Kubernetes deployments.
- cloudformation-msk.yml
  - Amazon MSK cluster for Kafka event streaming.
- cloudformation-mq.yml
  - Amazon MQ (RabbitMQ) for task queues and async workflows.
- cloudformation-rds.yml
  - RDS PostgreSQL primary data store.
- cloudformation-elasticache.yml
  - ElastiCache Redis cluster for caching and sessions.
- cloudformation-opensearch.yml
  - OpenSearch domain for search and analytics.
- cloudformation-s3.yml
  - S3 buckets for static assets and logs.

## Usage

Create the VPC first, then deploy the dependent services:

```bash
aws cloudformation create-stack \
  --stack-name movieverse-vpc \
  --template-body file://aws/cloudformation-vpc.yml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=movieverse-prod
```

Then deploy shared data plane components (RDS, Redis, MSK, MQ, OpenSearch) before application services.

## Notes

- Each template uses parameters for environment name, subnets, and instance sizing.
- For production, store secrets in AWS Secrets Manager and pass them into ECS/EKS as runtime secrets.
- Use `deployment/` automation scripts for blue-green and canary rollouts.
