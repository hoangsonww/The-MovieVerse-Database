# MovieVerse Deployment Architecture

## Overview

This document describes the production deployment architecture for MovieVerse, including infrastructure components, deployment strategies, and operational considerations.

## Architecture Diagram

### High-Level Architecture

```mermaid
graph TB
    Internet[Internet Users] --> CDN[CloudFront CDN<br/>Static Assets & Caching]
    CDN --> DNS[Route 53 DNS<br/>movie-verse.com]
    DNS --> ALB[Application Load Balancer<br/>SSL Termination<br/>Health Checks<br/>Request Routing]

    ALB --> TG_Blue[Target Group Blue<br/>Production]
    ALB --> TG_Green[Target Group Green<br/>Staging]

    TG_Blue --> ECS_Blue[ECS Service Blue<br/>Fargate Tasks]
    TG_Green --> ECS_Green[ECS Service Green<br/>Fargate Tasks]

    ECS_Blue --> App_Blue[MovieVerse App<br/>Container]
    ECS_Blue --> DD_Blue[Datadog<br/>Agent]

    ECS_Green --> App_Green[MovieVerse App<br/>Container]
    ECS_Green --> DD_Green[Datadog<br/>Agent]

    App_Blue --> DataLayer[Data Layer]
    App_Green --> DataLayer

    DataLayer --> RDS[RDS/Aurora<br/>PostgreSQL]
    DataLayer --> ElastiCache[ElastiCache<br/>Redis]
    DataLayer --> DynamoDB[DynamoDB]
    DataLayer --> DocumentDB[DocumentDB<br/>MongoDB]
    DataLayer --> S3[S3<br/>File Store]

    classDef cdn fill:#FF6B6B,stroke:#C92A2A,color:#fff
    classDef dns fill:#4ECDC4,stroke:#0E9594,color:#fff
    classDef alb fill:#FFE66D,stroke:#F7B731,color:#000
    classDef blue fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef green fill:#50C878,stroke:#2E7D4E,color:#fff
    classDef data fill:#9B59B6,stroke:#6C3483,color:#fff

    class CDN cdn
    class DNS dns
    class ALB alb
    class TG_Blue,ECS_Blue,App_Blue,DD_Blue blue
    class TG_Green,ECS_Green,App_Green,DD_Green green
    class DataLayer,RDS,ElastiCache,DynamoDB,DocumentDB,S3 data
```

### Kubernetes Architecture (Alternative)

```mermaid
graph TB
    Ingress[Ingress Controller<br/>NGINX with Canary Support]

    Ingress --> |100% traffic| SvcStable[Service: Stable]
    Ingress --> |Weighted traffic| SvcCanary[Service: Canary]

    SvcStable --> DepStable[Deployment: Stable<br/>Replicas: 5]
    SvcCanary --> DepCanary[Deployment: Canary<br/>Replicas: 1]

    DepStable --> PodStable[Pod Stable]
    DepCanary --> PodCanary[Pod Canary]

    PodStable --> AppStable[App Container]
    PodStable --> DDStable[Sidecar Datadog]

    PodCanary --> AppCanary[App Container]
    PodCanary --> DDCanary[Sidecar Datadog]

    AppStable --> Storage[Persistent Volume Claims<br/>ConfigMaps & Secrets]
    AppCanary --> Storage

    classDef ingress fill:#FF6B6B,stroke:#C92A2A,color:#fff
    classDef stable fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef canary fill:#FFE66D,stroke:#F7B731,color:#000
    classDef storage fill:#9B59B6,stroke:#6C3483,color:#fff

    class Ingress ingress
    class SvcStable,DepStable,PodStable,AppStable,DDStable stable
    class SvcCanary,DepCanary,PodCanary,AppCanary,DDCanary canary
    class Storage storage
```

## Infrastructure Components

### Networking

#### VPC Configuration
- **CIDR Block**: 10.0.0.0/16
- **Availability Zones**: 2 (us-east-1a, us-east-1b)
- **Public Subnets**: 10.0.1.0/24, 10.0.2.0/24
- **Private Subnets**: 10.0.11.0/24, 10.0.12.0/24
- **NAT Gateways**: 2 (one per AZ)
- **Internet Gateway**: 1

#### Load Balancing
- **Type**: Application Load Balancer (ALB)
- **Scheme**: Internet-facing
- **Cross-Zone Load Balancing**: Enabled
- **Health Check**: HTTP /health endpoint
- **SSL/TLS**: ACM certificate with automatic renewal

### Compute

#### ECS Fargate Configuration
```yaml
Task Definition:
  CPU: 512 (0.5 vCPU)
  Memory: 1024 MB (1 GB)
  Network Mode: awsvpc

Containers:
  - Name: movieverse-app
    Image: ECR Repository
    Port: 5000
    Environment: Production

  - Name: datadog-agent
    Image: Datadog Agent
    Essential: false
```

#### Auto-Scaling Configuration
```yaml
Auto-Scaling:
  Min Capacity: 2
  Max Capacity: 10
  Target CPU: 70%
  Target Memory: 80%
  Scale-in Cooldown: 300s
  Scale-out Cooldown: 60s
```

### Data Layer

#### Databases
- **PostgreSQL (RDS Aurora)**: Primary relational database
- **MongoDB (DocumentDB)**: Document storage
- **Redis (ElastiCache)**: Caching and session storage
- **MySQL (RDS)**: Legacy data

#### Storage
- **S3**: Static assets, backups, logs
- **EFS**: Shared file storage (if needed)

### Monitoring Stack

#### Prometheus
- **Purpose**: Metrics collection and alerting
- **Retention**: 15 days
- **Scrape Interval**: 15 seconds
- **Storage**: EBS volumes with snapshots

#### Datadog
- **APM**: Application performance monitoring
- **Logs**: Centralized log aggregation
- **Metrics**: Custom application metrics
- **Traces**: Distributed tracing

#### CloudWatch
- **Logs**: Container logs, application logs
- **Metrics**: Infrastructure metrics
- **Alarms**: Automated alerting
- **Dashboards**: Operational dashboards

## Deployment Strategies

### Blue-Green Deployment

#### Architecture

```mermaid
flowchart TB
    ALB[Application Load Balancer]

    ALB -->|"Production traffic"| TG_Blue[Target Group Blue<br/>(Production)]
    ALB -->|"Test traffic (port 8080)"| TG_Green[Target Group Green<br/>(Staging)]

    TG_Blue --> Blue_Services[Blue Services]
    TG_Green --> Green_Services[Green Services]

    TG_Blue <-->|Active switch| TG_Green

    classDef blue fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef green fill:#50C878,stroke:#2E7D4E,color:#fff
    class TG_Blue,Blue_Services blue
    class TG_Green,Green_Services green
```

#### Benefits
- **Zero Downtime**: Traffic switches instantly
- **Quick Rollback**: Switch back to previous environment
- **Full Testing**: Test complete environment before switch
- **Identical Environments**: Production parity

#### Drawbacks
- **Resource Cost**: Requires 2x infrastructure
- **Database Migrations**: Need to be backward compatible
- **Complexity**: Managing two complete environments

### Canary Deployment

#### Traffic Distribution

```mermaid
flowchart LR
    subgraph Stable
        S1[90%] --> S2[75%] --> S3[50%] --> S4[25%] --> S5[0%]
    end

    subgraph Canary
        C1[10%] --> C2[25%] --> C3[50%] --> C4[75%] --> C5[100%]
    end

    S1 -. Phase 1 .- C1
    S2 -. Phase 2 .- C2
    S3 -. Phase 3 .- C3
    S4 -. Phase 4 .- C4
    S5 -. Phase 5 .- C5

    classDef stable fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef canary fill:#FFE66D,stroke:#F7B731,color:#000
    class S1,S2,S3,S4,S5 stable
    class C1,C2,C3,C4,C5 canary
```

#### Automated Progression
```yaml
Analysis:
  Initial Delay: 1 minute
  Interval: 1 minute
  Threshold: 5 failures
  Max Weight: 50%
  Step Weight: 10%

Metrics:
  - Success Rate: > 99%
  - P99 Latency: < 500ms
  - Error Rate: < 1%
```

#### Benefits
- **Risk Mitigation**: Limited blast radius
- **Real Traffic Testing**: Actual production load
- **Automated Monitoring**: Auto rollback on issues
- **Gradual Rollout**: Progressive deployment

#### Drawbacks
- **Longer Deployment Time**: Gradual rollout takes time
- **Complexity**: Requires sophisticated monitoring
- **State Management**: Need to handle mixed versions

### Rolling Deployment

#### Process

```mermaid
flowchart TD
    Initial["Initial<br/>V1 V1 V1 V1 V1"]
    Step1["Step 1<br/>V2 V1 V1 V1 V1"]
    Step2["Step 2<br/>V2 V2 V1 V1 V1"]
    Step3["Step 3<br/>V2 V2 V2 V1 V1"]
    Step4["Step 4<br/>V2 V2 V2 V2 V1"]
    Final["Final<br/>V2 V2 V2 V2 V2"]

    Initial --> Step1 --> Step2 --> Step3 --> Step4 --> Final

    classDef v1 fill:#4A90E2,stroke:#2E5C8A,color:#fff
    classDef v2 fill:#50C878,stroke:#2E7D4E,color:#fff
    class Initial v1
    class Step1,Step2,Step3,Step4,Final v2
```

#### Configuration
```yaml
Deployment:
  Max Surge: 1 (25%)
  Max Unavailable: 0 (0%)
  Progress Deadline: 600s
  Revision History Limit: 10
```

#### Benefits
- **Resource Efficient**: No duplicate infrastructure
- **Simple**: Easiest to implement
- **Built-in**: Native ECS/K8s support

#### Drawbacks
- **Mixed Versions**: Old and new running simultaneously
- **Gradual Issues**: Problems may not be immediately obvious
- **Database Migrations**: Must be backward compatible

## Security Architecture

### Network Security

```mermaid
flowchart TB
    Internet[Internet (0.0.0.0/0)]
    ALB_SG[ALB Security Group<br/>Inbound: 80, 443 from Internet]
    ECS_SG[ECS Tasks Security Group<br/>Inbound: 5000 from ALB SG]
    DB_SG[Database Security Group<br/>Inbound: 3306, 5432, 6379, 27017 from ECS SG]

    Internet -->|"Ports 80/443"| ALB_SG -->|"Port 5000"| ECS_SG -->|"DB ports"| DB_SG
```

### IAM Roles

#### Task Execution Role
- ECR image pull
- CloudWatch Logs write
- Secrets Manager read

#### Task Role
- DynamoDB access
- S3 read/write
- CloudWatch metrics write

#### Service Account (Kubernetes)
- ConfigMap/Secret read
- Pod read
- Service read

### Secrets Management

```yaml
AWS Secrets Manager:
  - Database credentials
  - API keys
  - JWT secrets

Environment Variables:
  - Non-sensitive configuration
  - Feature flags
  - Service endpoints

ConfigMaps (K8s):
  - Application configuration
  - Service discovery
```

## Disaster Recovery

### Backup Strategy

```yaml
Database Backups:
  RDS Aurora:
    Automated: Daily at 3 AM UTC
    Retention: 30 days
    Cross-Region: Enabled (us-west-2)

  DocumentDB:
    Automated: Daily
    Retention: 7 days

  ElastiCache:
    Snapshots: Daily
    Retention: 7 days

Application Backups:
  ECS Task Definitions: Version controlled
  Kubernetes Manifests: Git repository
  Infrastructure: CloudFormation templates
```

### Recovery Objectives

- **RTO (Recovery Time Objective)**: 1 hour
- **RPO (Recovery Point Objective)**: 15 minutes

### DR Procedures

1. **Database Restoration**: 15-20 minutes
2. **Application Deployment**: 10-15 minutes
3. **DNS Propagation**: 5-10 minutes
4. **Verification**: 10-15 minutes

**Total Recovery Time**: ~45-60 minutes

## Cost Optimization

### Monthly Cost Breakdown (Estimated)

```
ECS Fargate (Production):
  - Tasks (avg 5): $75/month
  - Data Transfer: $20/month

Load Balancer:
  - ALB: $25/month
  - Data Processing: $15/month

Databases:
  - RDS Aurora: $150/month
  - DocumentDB: $100/month
  - ElastiCache: $50/month

Monitoring:
  - CloudWatch: $30/month
  - Datadog: $100/month

Storage:
  - S3: $20/month
  - EBS: $15/month

Total: ~$600/month
```

### Optimization Strategies

1. **Right-sizing**: Monitor and adjust instance sizes
2. **Spot Instances**: Use for non-production environments
3. **Reserved Capacity**: 1-year commitments for databases
4. **Auto-Scaling**: Scale down during off-peak hours
5. **S3 Lifecycle**: Move old data to cheaper storage classes

## Scalability

### Current Capacity
- **Requests per second**: 1,000
- **Concurrent users**: 10,000
- **Database connections**: 100

### Scaling Limits
- **ECS Tasks**: Up to 100 per service
- **ALB**: 500,000 requests/second
- **Database**: Aurora read replicas up to 15

### Bottlenecks
1. **Database**: Add read replicas
2. **Compute**: Increase task count or size
3. **Network**: Use CloudFront CDN
4. **Cache**: Scale ElastiCache cluster

## Future Enhancements

1. **Multi-Region Deployment**: Active-active across regions
2. **Service Mesh**: Implement Istio for advanced traffic management
3. **GitOps**: Implement ArgoCD/Flux for Kubernetes deployments
4. **Chaos Engineering**: Implement failure injection testing
5. **Cost Optimization**: FinOps practices and tools
