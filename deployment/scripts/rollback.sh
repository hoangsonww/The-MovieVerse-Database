#!/bin/bash
set -euo pipefail

##############################################################################
# Automatic Rollback Script
# Handles rollback for different deployment strategies
##############################################################################

# Configuration
REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="${ECS_CLUSTER:-movieverse-prod-cluster}"
NAMESPACE="${K8S_NAMESPACE:-movieverse}"
DEPLOYMENT_STRATEGY="${DEPLOYMENT_STRATEGY:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Rollback blue-green deployment
rollback_blue_green() {
    log_info "Rolling back blue-green deployment..."

    # Run the blue-green switch script to revert to previous environment
    if [ -f "./deployment/scripts/blue-green-switch.sh" ]; then
        bash ./deployment/scripts/blue-green-switch.sh
    else
        log_error "Blue-green switch script not found"
        return 1
    fi

    log_info "Blue-green rollback completed"
}

# Rollback canary deployment
rollback_canary() {
    log_info "Rolling back canary deployment..."

    # Scale down canary deployment
    kubectl scale deployment/movieverse-canary --replicas=0 -n "$NAMESPACE"

    # Reset canary ingress weight to 0
    kubectl patch ingress movieverse-canary \
        -n "$NAMESPACE" \
        --type=json \
        -p='[{"op": "replace", "path": "/metadata/annotations/nginx.ingress.kubernetes.io~1canary-weight", "value": "0"}]'

    # If using Flagger, pause the canary
    if kubectl get canary movieverse -n "$NAMESPACE" &> /dev/null; then
        kubectl patch canary movieverse \
            -n "$NAMESPACE" \
            --type=json \
            -p='[{"op": "replace", "path": "/spec/skipAnalysis", "value": true}]'
    fi

    log_info "Canary rollback completed"
}

# Rollback ECS rolling deployment
rollback_ecs_rolling() {
    log_info "Rolling back ECS rolling deployment..."

    SERVICE_NAME="${1:-movieverse-prod-service-blue}"

    # Get previous task definition
    CURRENT_TASK_DEF=$(aws ecs describe-services \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --services "$SERVICE_NAME" \
        --query 'services[0].taskDefinition' \
        --output text)

    # Extract task family and revision
    TASK_FAMILY=$(echo "$CURRENT_TASK_DEF" | cut -d'/' -f2 | cut -d':' -f1)
    CURRENT_REVISION=$(echo "$CURRENT_TASK_DEF" | cut -d':' -f2)
    PREVIOUS_REVISION=$((CURRENT_REVISION - 1))

    if [ "$PREVIOUS_REVISION" -lt 1 ]; then
        log_error "No previous revision found for rollback"
        return 1
    fi

    PREVIOUS_TASK_DEF="${TASK_FAMILY}:${PREVIOUS_REVISION}"

    log_info "Rolling back from $CURRENT_TASK_DEF to $PREVIOUS_TASK_DEF"

    # Update service with previous task definition
    aws ecs update-service \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --service "$SERVICE_NAME" \
        --task-definition "$PREVIOUS_TASK_DEF" \
        --force-new-deployment

    # Wait for service to stabilize
    log_info "Waiting for service to stabilize..."
    aws ecs wait services-stable \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --services "$SERVICE_NAME"

    log_info "ECS rolling deployment rollback completed"
}

# Rollback Kubernetes rolling deployment
rollback_k8s_rolling() {
    log_info "Rolling back Kubernetes rolling deployment..."

    DEPLOYMENT_NAME="${1:-movieverse-stable}"

    # Rollback to previous revision
    kubectl rollout undo deployment/"$DEPLOYMENT_NAME" -n "$NAMESPACE"

    # Wait for rollout to complete
    log_info "Waiting for rollback to complete..."
    kubectl rollout status deployment/"$DEPLOYMENT_NAME" -n "$NAMESPACE" --timeout=5m

    log_info "Kubernetes rolling deployment rollback completed"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2

    # Send Slack notification if webhook is configured
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{
                \"text\": \"Rollback Alert\",
                \"attachments\": [{
                    \"color\": \"$([[ $status == 'success' ]] && echo 'good' || echo 'danger')\",
                    \"title\": \"MovieVerse Deployment Rollback\",
                    \"text\": \"$message\",
                    \"fields\": [
                        {\"title\": \"Strategy\", \"value\": \"$DEPLOYMENT_STRATEGY\", \"short\": true},
                        {\"title\": \"Status\", \"value\": \"$status\", \"short\": true},
                        {\"title\": \"Time\", \"value\": \"$(date '+%Y-%m-%d %H:%M:%S')\", \"short\": false}
                    ]
                }]
            }"
    fi

    # Send email notification if configured
    if [ -n "${NOTIFICATION_EMAIL:-}" ]; then
        echo "$message" | mail -s "MovieVerse Deployment Rollback - $status" "$NOTIFICATION_EMAIL"
    fi
}

# Create deployment marker
create_deployment_marker() {
    local status=$1

    # Create marker in DataDog if API key is available
    if [ -n "${DATADOG_API_KEY:-}" ]; then
        curl -X POST "https://api.datadoghq.com/api/v1/events" \
            -H "DD-API-KEY: $DATADOG_API_KEY" \
            -H "Content-Type: application/json" \
            -d "{
                \"title\": \"MovieVerse Rollback\",
                \"text\": \"Rollback executed for deployment strategy: $DEPLOYMENT_STRATEGY\",
                \"priority\": \"normal\",
                \"tags\": [\"environment:production\", \"service:movieverse\", \"action:rollback\", \"status:$status\"],
                \"alert_type\": \"error\"
            }"
    fi
}

# Main function
main() {
    log_info "=== Starting Rollback Procedure ==="

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --strategy)
                DEPLOYMENT_STRATEGY="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 --strategy <blue-green|canary|ecs-rolling|k8s-rolling>"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    if [ -z "$DEPLOYMENT_STRATEGY" ]; then
        log_error "Deployment strategy not specified. Use --strategy flag."
        exit 1
    fi

    log_info "Rollback strategy: $DEPLOYMENT_STRATEGY"

    # Execute rollback based on strategy
    case "$DEPLOYMENT_STRATEGY" in
        blue-green)
            rollback_blue_green
            ;;
        canary)
            rollback_canary
            ;;
        ecs-rolling)
            rollback_ecs_rolling
            ;;
        k8s-rolling)
            rollback_k8s_rolling
            ;;
        *)
            log_error "Unknown deployment strategy: $DEPLOYMENT_STRATEGY"
            exit 1
            ;;
    esac

    ROLLBACK_STATUS=$?

    if [ $ROLLBACK_STATUS -eq 0 ]; then
        log_info "=== Rollback Completed Successfully ==="
        send_notification "success" "Rollback completed successfully for $DEPLOYMENT_STRATEGY deployment"
        create_deployment_marker "success"
        exit 0
    else
        log_error "=== Rollback Failed ==="
        send_notification "failed" "Rollback failed for $DEPLOYMENT_STRATEGY deployment"
        create_deployment_marker "failed"
        exit 1
    fi
}

# Run main function
main "$@"
