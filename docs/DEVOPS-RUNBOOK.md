# MovieVerse DevOps Runbook

## Quick Reference

### Emergency Contacts
- **On-Call Engineer**: PagerDuty rotation
- **DevOps Lead**: devops-lead@movie-verse.com
- **Slack Channel**: #movieverse-incidents

### Critical URLs
- **Production**: https://movie-verse.com
- **Blue Environment**: https://blue.movie-verse.com
- **Green Environment**: https://green.movie-verse.com
- **Jenkins**: https://jenkins.movie-verse.com
- **Datadog**: https://app.datadoghq.com
- **AWS Console**: https://console.aws.amazon.com

## Incident Response

### Severity Levels

- **P1 - Critical**: Complete service outage
- **P2 - High**: Major feature impaired
- **P3 - Medium**: Minor feature impaired
- **P4 - Low**: Cosmetic issue

### P1 - Service Down

1. **Acknowledge incident** in PagerDuty
2. **Join incident bridge**: Zoom link in PagerDuty alert
3. **Check service status**:
   ```bash
   # Check ECS services
   aws ecs describe-services \
     --cluster movieverse-prod-cluster \
     --services movieverse-prod-service-blue movieverse-prod-service-green

   # Check load balancer health
   aws elbv2 describe-target-health \
     --target-group-arn <tg-arn>
   ```

4. **Review recent deployments**:
   ```bash
   # Check recent Jenkins builds
   # Check recent ECS deployments
   aws ecs list-task-definitions \
     --family-prefix movieverse-prod --max-results 5
   ```

5. **Initiate rollback** if caused by recent deployment:
   ```bash
   ./deployment/scripts/rollback.sh --strategy blue-green
   ```

6. **Create incident report** in Confluence

### P2 - High Error Rate

1. **Check error metrics**:
   - Datadog APM error rate dashboard
   - CloudWatch logs for error patterns
   ```bash
   aws logs filter-log-events \
     --log-group-name /ecs/movieverse-prod \
     --filter-pattern "ERROR" \
     --start-time $(date -d '15 minutes ago' +%s)000
   ```

2. **Identify error source**:
   - Database connectivity
   - External API failures
   - Application bugs

3. **Apply immediate mitigation**:
   - Scale up resources
   - Enable circuit breakers
   - Rollback if needed

4. **Monitor recovery**

### Failed Deployment

1. **Check deployment logs**:
   ```bash
   # Jenkins console output
   # ECS deployment events
   aws ecs describe-services \
     --cluster movieverse-prod-cluster \
     --services movieverse-prod-service-blue \
     --query 'services[0].events[0:20]'
   ```

2. **Identify failure reason**:
   - Health check failures
   - Task launch failures
   - Resource constraints

3. **Execute rollback**:
   ```bash
   ./deployment/scripts/rollback.sh --strategy <strategy>
   ```

4. **Fix issue and redeploy**

## Routine Operations

### Daily Tasks

#### Morning Checks (9 AM)
```bash
# Check system health
./deployment/scripts/health-check.sh --url https://movie-verse.com --type comprehensive

# Review overnight alerts
# Check Datadog dashboard
# Review CloudWatch metrics
```

#### Review Deployment Status
```bash
# Check running tasks
aws ecs list-tasks --cluster movieverse-prod-cluster

# Check service status
kubectl get pods -n movieverse
kubectl get deployments -n movieverse
```

### Weekly Tasks

#### Monday - Capacity Planning
- Review resource utilization trends
- Check auto-scaling metrics
- Plan capacity adjustments

#### Wednesday - Security Review
```bash
# Run security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image movieverse:latest

# Check for CVEs
npm audit
```

#### Friday - Deployment Review
- Review week's deployments
- Check deployment success rate
- Update runbook if needed

### Monthly Tasks

#### Certificate Management
```bash
# Check SSL certificates
./deployment/scripts/health-check.sh --url https://movie-verse.com

# Renew certificates if needed (automated with cert-manager/ACM)
```

#### Cost Optimization Review
- Review AWS cost dashboard
- Identify optimization opportunities
- Right-size resources

#### Backup Verification
- Verify database backups
- Test backup restoration
- Update backup retention policies

## Deployment Procedures

### Standard Deployment (Blue-Green)

```bash
# 1. Pre-deployment checks
./deployment/scripts/health-check.sh --url https://movie-verse.com

# 2. Trigger deployment
# Via Jenkins UI or:
curl -X POST https://jenkins.movie-verse.com/job/movieverse-deploy/buildWithParameters \
  -d "DEPLOYMENT_STRATEGY=blue-green" \
  -d "ENVIRONMENT=production" \
  -d "IMAGE_TAG=v2.0.0"

# 3. Monitor deployment
# Watch Jenkins console
# Monitor CloudWatch metrics
# Check Datadog APM

# 4. Post-deployment verification
./deployment/scripts/health-check.sh --url https://movie-verse.com
```

### Emergency Hotfix

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-fix

# 2. Apply fix and commit
git commit -m "fix: critical bug fix"

# 3. Build and push image
docker build -t movieverse:hotfix-$(git rev-parse --short HEAD) .
docker push <ecr-repo>/movieverse:hotfix-$(git rev-parse --short HEAD)

# 4. Deploy immediately
# Use rolling deployment for faster rollout
curl -X POST https://jenkins.movie-verse.com/job/movieverse-deploy/buildWithParameters \
  -d "DEPLOYMENT_STRATEGY=rolling" \
  -d "ENVIRONMENT=production" \
  -d "IMAGE_TAG=hotfix-$(git rev-parse --short HEAD)" \
  -d "AUTO_APPROVE=true"

# 5. Monitor closely
watch -n 5 './deployment/scripts/health-check.sh --url https://movie-verse.com'
```

### Scaling Operations

#### Manual Scaling

```bash
# Scale ECS service
aws ecs update-service \
  --cluster movieverse-prod-cluster \
  --service movieverse-prod-service-blue \
  --desired-count 10

# Scale Kubernetes deployment
kubectl scale deployment movieverse-stable --replicas=10 -n movieverse
```

#### Auto-Scaling Adjustment

```bash
# Update auto-scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name movieverse-cpu-scaling \
  --service-namespace ecs \
  --resource-id service/movieverse-prod-cluster/movieverse-prod-service-blue \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Monitoring and Alerts

### Key Dashboards

#### Datadog Dashboards
- **Production Overview**: All key metrics
- **Deployment Status**: Blue/Green/Canary status
- **Error Tracking**: Error rates and types
- **Performance**: Latency and throughput

#### CloudWatch Dashboards
- **ECS Cluster**: CPU, memory, task counts
- **ALB**: Request count, latency, errors
- **Logs Insights**: Custom queries

### Alert Investigation

#### High Error Rate Alert

```bash
# 1. Check error distribution
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=TargetGroup,Value=<tg-arn> \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum

# 2. Check application logs
aws logs filter-log-events \
  --log-group-name /ecs/movieverse-prod \
  --filter-pattern "ERROR" \
  --start-time $(date -d '1 hour ago' +%s)000

# 3. Check Datadog APM for error traces
# Navigate to APM > Error Tracking

# 4. Correlate with deployments
# Check if errors started after recent deployment
```

#### High Latency Alert

```bash
# 1. Check P99 latency
# Review Datadog APM performance metrics

# 2. Check database performance
# Review RDS/Aurora metrics
# Check slow query logs

# 3. Check resource utilization
aws ecs describe-services \
  --cluster movieverse-prod-cluster \
  --services movieverse-prod-service-blue

# 4. Consider scaling
# Increase task count or instance size
```

## Backup and Recovery

### Database Backups

```bash
# Verify automated backups
aws rds describe-db-snapshots \
  --db-instance-identifier movieverse-prod-db

# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier movieverse-prod-db \
  --db-snapshot-identifier movieverse-manual-$(date +%Y%m%d-%H%M)
```

### Application State Backup

```bash
# Backup Kubernetes resources
kubectl get all -n movieverse -o yaml > backup-$(date +%Y%m%d).yaml

# Backup ECS task definitions
aws ecs describe-task-definition \
  --task-definition movieverse-prod-task-blue \
  > task-definition-backup-$(date +%Y%m%d).json
```

### Disaster Recovery

#### Complete Service Recovery

1. **Verify backups** are available and recent
2. **Restore database** from latest snapshot:
   ```bash
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier movieverse-prod-db-restored \
     --db-snapshot-identifier <snapshot-id>
   ```

3. **Redeploy application**:
   ```bash
   # Deploy from last known good version
   aws ecs update-service \
     --cluster movieverse-prod-cluster \
     --service movieverse-prod-service-blue \
     --task-definition movieverse-prod-task-blue:<revision>
   ```

4. **Update DNS** if needed
5. **Verify functionality**

## Security Operations

### Security Incident Response

1. **Isolate affected resources**
2. **Preserve evidence**
3. **Contain the incident**
4. **Eradicate the threat**
5. **Recover services**
6. **Post-incident analysis**

### Access Management

```bash
# List IAM users with admin access
aws iam list-users --query 'Users[?UserName].[UserName]'

# Rotate credentials
aws iam create-access-key --user-name <username>
aws iam delete-access-key --user-name <username> --access-key-id <old-key>

# Review service account permissions
kubectl get serviceaccounts -n movieverse
```

### Vulnerability Management

```bash
# Scan container images
trivy image movieverse:latest

# Check for security updates
npm audit
pip check

# Review security groups
aws ec2 describe-security-groups \
  --filters Name=group-name,Values=movieverse-*
```

## Performance Optimization

### Identify Performance Bottlenecks

```bash
# Check CloudWatch metrics
# Review Datadog APM flame graphs
# Analyze slow queries in database

# Profile application
# Enable detailed logging temporarily
```

### Apply Optimizations

1. **Database optimization**
   - Add indexes
   - Optimize queries
   - Enable caching

2. **Application optimization**
   - Code profiling
   - Memory leak detection
   - Enable compression

3. **Infrastructure optimization**
   - Right-size instances
   - Use caching layers
   - CDN for static assets

## Compliance and Audit

### Audit Logging

```bash
# Check CloudTrail logs
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=UpdateService \
  --start-time $(date -d '7 days ago' +%Y-%m-%d)

# Review deployment history
aws ecs list-task-definitions \
  --family-prefix movieverse-prod \
  --max-results 20
```

### Compliance Reports

- **Weekly**: Deployment success rate
- **Monthly**: Security scan results
- **Quarterly**: Cost optimization report
- **Annually**: DR test results

## Appendix

### Useful Commands Cheat Sheet

```bash
# Get current active environment
./deployment/scripts/blue-green-switch.sh --help

# Force service update
aws ecs update-service --cluster <cluster> --service <service> --force-new-deployment

# Describe running tasks
aws ecs list-tasks --cluster <cluster> --service-name <service>

# View logs
aws logs tail /ecs/movieverse-prod --follow

# Check pod status
kubectl get pods -n movieverse -o wide

# Describe pod
kubectl describe pod <pod-name> -n movieverse

# Get pod logs
kubectl logs <pod-name> -n movieverse -f

# Execute command in pod
kubectl exec -it <pod-name> -n movieverse -- /bin/bash
```

### Configuration Files Location

- **AWS CloudFormation**: `aws/*.yml`
- **Kubernetes manifests**: `kubernetes/`
- **Deployment scripts**: `deployment/scripts/`
- **Monitoring configs**: `deployment/configs/`
- **Jenkins pipeline**: `Jenkinsfile`

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-01-26 | Initial runbook creation | DevOps Team |
| | Blue-Green deployment procedures | |
| | Canary deployment procedures | |
| | Monitoring and alerting setup | |
