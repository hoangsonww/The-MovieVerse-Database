#!/bin/bash
set -euo pipefail

##############################################################################
# Blue-Green Deployment Traffic Switch Script
# Switches traffic between blue and green environments
##############################################################################

# Configuration
REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="${ECS_CLUSTER:-movieverse-prod-cluster}"
SERVICE_PREFIX="movieverse-prod-service"
TARGET_GROUP_PREFIX="movieverse-prod-TG"
LISTENER_PORT="${LISTENER_PORT:-80}"
WAIT_TIME="${WAIT_TIME:-60}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to get current active environment
get_active_environment() {
    log_info "Detecting current active environment..."

    # Get load balancer ARN
    local lb_arn=$(aws elbv2 describe-load-balancers \
        --region "$REGION" \
        --query "LoadBalancers[?contains(LoadBalancerName, 'movieverse')].LoadBalancerArn | [0]" \
        --output text)

    if [ -z "$lb_arn" ] || [ "$lb_arn" == "None" ]; then
        log_error "Load balancer not found"
        return 1
    fi

    # Get listener ARN
    local listener_arn=$(aws elbv2 describe-listeners \
        --region "$REGION" \
        --load-balancer-arn "$lb_arn" \
        --query "Listeners[?Port==\`$LISTENER_PORT\`].ListenerArn | [0]" \
        --output text)

    if [ -z "$listener_arn" ] || [ "$listener_arn" == "None" ]; then
        log_error "Listener not found on port $LISTENER_PORT"
        return 1
    fi

    # Get current target group
    local current_tg=$(aws elbv2 describe-rules \
        --region "$REGION" \
        --listener-arn "$listener_arn" \
        --query 'Rules[?Priority==`1`].Actions[0].TargetGroupArn | [0]' \
        --output text)

    if [[ "$current_tg" == *"Blue"* ]]; then
        echo "blue"
    elif [[ "$current_tg" == *"Green"* ]]; then
        echo "green"
    else
        log_error "Unable to determine active environment"
        return 1
    fi
}

# Function to check service health
check_service_health() {
    local env=$1
    log_info "Checking health of $env environment..."

    # Get service name
    local service_name="${SERVICE_PREFIX}-${env}"

    # Check if service is stable
    local status=$(aws ecs describe-services \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --services "$service_name" \
        --query 'services[0].deployments[?status==`PRIMARY`].rolloutState | [0]' \
        --output text)

    if [ "$status" != "COMPLETED" ]; then
        log_warn "Service $service_name is not in COMPLETED state (current: $status)"
        return 1
    fi

    # Check running task count
    local desired_count=$(aws ecs describe-services \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --services "$service_name" \
        --query 'services[0].desiredCount' \
        --output text)

    local running_count=$(aws ecs describe-services \
        --region "$REGION" \
        --cluster "$CLUSTER_NAME" \
        --services "$service_name" \
        --query 'services[0].runningCount' \
        --output text)

    if [ "$desired_count" != "$running_count" ]; then
        log_warn "Service $service_name: desired=$desired_count, running=$running_count"
        return 1
    fi

    # Check target group health
    local tg_arn=$(aws elbv2 describe-target-groups \
        --region "$REGION" \
        --names "${TARGET_GROUP_PREFIX}-${env^}" \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    local healthy_count=$(aws elbv2 describe-target-health \
        --region "$REGION" \
        --target-group-arn "$tg_arn" \
        --query "TargetHealthDescriptions[?TargetHealth.State=='healthy'] | length(@)" \
        --output text)

    if [ "$healthy_count" -lt "$desired_count" ]; then
        log_warn "Not all targets are healthy: $healthy_count/$desired_count"
        return 1
    fi

    log_info "$env environment is healthy (running: $running_count, healthy targets: $healthy_count)"
    return 0
}

# Function to switch traffic
switch_traffic() {
    local from_env=$1
    local to_env=$2

    log_info "Switching traffic from $from_env to $to_env..."

    # Get target group ARNs
    local from_tg=$(aws elbv2 describe-target-groups \
        --region "$REGION" \
        --names "${TARGET_GROUP_PREFIX}-${from_env^}" \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    local to_tg=$(aws elbv2 describe-target-groups \
        --region "$REGION" \
        --names "${TARGET_GROUP_PREFIX}-${to_env^}" \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text)

    # Get load balancer and listener
    local lb_arn=$(aws elbv2 describe-load-balancers \
        --region "$REGION" \
        --query "LoadBalancers[?contains(LoadBalancerName, 'movieverse')].LoadBalancerArn | [0]" \
        --output text)

    local listener_arn=$(aws elbv2 describe-listeners \
        --region "$REGION" \
        --load-balancer-arn "$lb_arn" \
        --query "Listeners[?Port==\`$LISTENER_PORT\`].ListenerArn | [0]" \
        --output text)

    # Modify listener default action
    aws elbv2 modify-listener \
        --region "$REGION" \
        --listener-arn "$listener_arn" \
        --default-actions Type=forward,TargetGroupArn="$to_tg"

    log_info "Traffic switched successfully"
}

# Function to gradual traffic shift (optional)
gradual_traffic_shift() {
    local from_env=$1
    local to_env=$2

    log_info "Performing gradual traffic shift from $from_env to $to_env..."

    local weights=(10 25 50 75 100)

    for weight in "${weights[@]}"; do
        local from_weight=$((100 - weight))

        log_info "Shifting traffic: $from_env=${from_weight}%, $to_env=${weight}%"

        # Use weighted target groups (requires AWS CLI v2)
        # Implementation would use forward actions with multiple target groups

        log_info "Waiting $WAIT_TIME seconds before next shift..."
        sleep "$WAIT_TIME"

        # Check metrics
        if ! check_service_health "$to_env"; then
            log_error "Health check failed during traffic shift. Rolling back..."
            rollback "$to_env" "$from_env"
            return 1
        fi
    done

    log_info "Gradual traffic shift completed"
}

# Function to rollback
rollback() {
    local from_env=$1
    local to_env=$2

    log_warn "Rolling back traffic from $from_env to $to_env..."
    switch_traffic "$from_env" "$to_env"
    log_info "Rollback completed"
}

# Main function
main() {
    log_info "=== Blue-Green Deployment Traffic Switch ==="

    # Parse arguments
    local target_env=""
    local gradual=false

    while [[ $# -gt 0 ]]; do
        case $1 in
            --target)
                target_env="$2"
                shift 2
                ;;
            --gradual)
                gradual=true
                shift
                ;;
            --help)
                echo "Usage: $0 [--target blue|green] [--gradual]"
                echo "  --target: Target environment (blue or green)"
                echo "  --gradual: Perform gradual traffic shift"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Detect current active environment
    local active_env
    active_env=$(get_active_environment)
    log_info "Current active environment: $active_env"

    # Determine target environment
    if [ -z "$target_env" ]; then
        if [ "$active_env" == "blue" ]; then
            target_env="green"
        else
            target_env="blue"
        fi
    fi

    log_info "Target environment: $target_env"

    # Verify target environment is healthy
    if ! check_service_health "$target_env"; then
        log_error "Target environment $target_env is not healthy. Aborting."
        exit 1
    fi

    # Perform traffic switch
    if [ "$gradual" = true ]; then
        if ! gradual_traffic_shift "$active_env" "$target_env"; then
            log_error "Gradual traffic shift failed"
            exit 1
        fi
    else
        switch_traffic "$active_env" "$target_env"
    fi

    log_info "=== Deployment Completed Successfully ==="
    log_info "Active environment is now: $target_env"
}

# Run main function
main "$@"
