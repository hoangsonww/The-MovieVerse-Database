#!/bin/bash
set -euo pipefail

##############################################################################
# Health Check Script
# Comprehensive health checks for MovieVerse deployments
##############################################################################

# Configuration
TIMEOUT="${TIMEOUT:-30}"
MAX_RETRIES="${MAX_RETRIES:-3}"
RETRY_DELAY="${RETRY_DELAY:-5}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# HTTP health check
check_http_endpoint() {
    local endpoint=$1
    local expected_status=${2:-200}
    local retries=0

    log_info "Checking HTTP endpoint: $endpoint"

    while [ $retries -lt $MAX_RETRIES ]; do
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout "$TIMEOUT" \
            --max-time "$TIMEOUT" \
            "$endpoint" || echo "000")

        if [ "$status_code" == "$expected_status" ]; then
            log_info "✓ HTTP check passed (status: $status_code)"
            return 0
        else
            retries=$((retries + 1))
            log_warn "HTTP check failed (status: $status_code), retry $retries/$MAX_RETRIES"

            if [ $retries -lt $MAX_RETRIES ]; then
                sleep "$RETRY_DELAY"
            fi
        fi
    done

    log_error "✗ HTTP check failed after $MAX_RETRIES retries"
    return 1
}

# Check response time
check_response_time() {
    local endpoint=$1
    local max_time=${2:-1000}  # milliseconds

    log_info "Checking response time for: $endpoint"

    local response_time=$(curl -s -o /dev/null -w "%{time_total}" \
        --connect-timeout "$TIMEOUT" \
        --max-time "$TIMEOUT" \
        "$endpoint" || echo "0")

    # Convert to milliseconds
    local response_time_ms=$(echo "$response_time * 1000" | bc | cut -d'.' -f1)

    if [ "$response_time_ms" -le "$max_time" ]; then
        log_info "✓ Response time check passed (${response_time_ms}ms <= ${max_time}ms)"
        return 0
    else
        log_error "✗ Response time check failed (${response_time_ms}ms > ${max_time}ms)"
        return 1
    fi
}

# Check database connectivity
check_database() {
    local db_type=$1
    local db_host=$2
    local db_port=$3

    log_info "Checking $db_type database connectivity: $db_host:$db_port"

    case "$db_type" in
        postgresql|postgres)
            if command -v pg_isready &> /dev/null; then
                if pg_isready -h "$db_host" -p "$db_port" -t "$TIMEOUT"; then
                    log_info "✓ PostgreSQL database is ready"
                    return 0
                fi
            else
                # Fallback to nc
                if nc -zv -w "$TIMEOUT" "$db_host" "$db_port" &> /dev/null; then
                    log_info "✓ PostgreSQL port is open"
                    return 0
                fi
            fi
            ;;
        mysql|mariadb)
            if nc -zv -w "$TIMEOUT" "$db_host" "$db_port" &> /dev/null; then
                log_info "✓ MySQL port is open"
                return 0
            fi
            ;;
        mongodb|mongo)
            if nc -zv -w "$TIMEOUT" "$db_host" "$db_port" &> /dev/null; then
                log_info "✓ MongoDB port is open"
                return 0
            fi
            ;;
        redis)
            if command -v redis-cli &> /dev/null; then
                if redis-cli -h "$db_host" -p "$db_port" ping | grep -q PONG; then
                    log_info "✓ Redis is responding"
                    return 0
                fi
            else
                if nc -zv -w "$TIMEOUT" "$db_host" "$db_port" &> /dev/null; then
                    log_info "✓ Redis port is open"
                    return 0
                fi
            fi
            ;;
    esac

    log_error "✗ $db_type database check failed"
    return 1
}

# Check API endpoints
check_api_health() {
    local base_url=$1

    log_info "Running API health checks..."

    local endpoints=(
        "/health:200"
        "/ready:200"
        "/api/v1/movies:200,401"  # Accept both 200 and 401 (auth required)
    )

    local failed=0

    for endpoint_config in "${endpoints[@]}"; do
        local endpoint=$(echo "$endpoint_config" | cut -d':' -f1)
        local expected_codes=$(echo "$endpoint_config" | cut -d':' -f2)

        local url="${base_url}${endpoint}"
        local status_code=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout "$TIMEOUT" \
            --max-time "$TIMEOUT" \
            "$url" || echo "000")

        if echo "$expected_codes" | grep -q "$status_code"; then
            log_info "✓ $endpoint (status: $status_code)"
        else
            log_error "✗ $endpoint (status: $status_code, expected: $expected_codes)"
            failed=$((failed + 1))
        fi
    done

    if [ $failed -eq 0 ]; then
        log_info "All API health checks passed"
        return 0
    else
        log_error "$failed API health check(s) failed"
        return 1
    fi
}

# Check SSL certificate
check_ssl_certificate() {
    local domain=$1
    local days_warning=${2:-30}

    log_info "Checking SSL certificate for: $domain"

    local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | \
        openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -z "$expiry_date" ]; then
        log_warn "Unable to retrieve SSL certificate"
        return 1
    fi

    local expiry_epoch=$(date -d "$expiry_date" +%s)
    local current_epoch=$(date +%s)
    local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

    if [ "$days_until_expiry" -lt 0 ]; then
        log_error "✗ SSL certificate expired!"
        return 1
    elif [ "$days_until_expiry" -lt "$days_warning" ]; then
        log_warn "⚠ SSL certificate expires in $days_until_expiry days"
        return 0
    else
        log_info "✓ SSL certificate is valid (expires in $days_until_expiry days)"
        return 0
    fi
}

# Comprehensive health check
comprehensive_check() {
    local base_url=$1
    local failed=0

    log_info "=== Running Comprehensive Health Check ==="

    # HTTP health check
    if ! check_http_endpoint "${base_url}/health"; then
        failed=$((failed + 1))
    fi

    # Response time check
    if ! check_response_time "${base_url}/health" 1000; then
        failed=$((failed + 1))
    fi

    # API health checks
    if ! check_api_health "$base_url"; then
        failed=$((failed + 1))
    fi

    # Database checks (if environment variables are set)
    if [ -n "${POSTGRES_HOST:-}" ]; then
        if ! check_database "postgresql" "$POSTGRES_HOST" "${POSTGRES_PORT:-5432}"; then
            failed=$((failed + 1))
        fi
    fi

    if [ -n "${MYSQL_HOST:-}" ]; then
        if ! check_database "mysql" "$MYSQL_HOST" "${MYSQL_PORT:-3306}"; then
            failed=$((failed + 1))
        fi
    fi

    if [ -n "${MONGODB_HOST:-}" ]; then
        if ! check_database "mongodb" "$MONGODB_HOST" "${MONGODB_PORT:-27017}"; then
            failed=$((failed + 1))
        fi
    fi

    if [ -n "${REDIS_HOST:-}" ]; then
        if ! check_database "redis" "$REDIS_HOST" "${REDIS_PORT:-6379}"; then
            failed=$((failed + 1))
        fi
    fi

    log_info "=== Health Check Complete ==="

    if [ $failed -eq 0 ]; then
        log_info "✓ All health checks passed"
        return 0
    else
        log_error "✗ $failed health check(s) failed"
        return 1
    fi
}

# Main function
main() {
    local url=""
    local check_type="comprehensive"

    while [[ $# -gt 0 ]]; do
        case $1 in
            --url)
                url="$2"
                shift 2
                ;;
            --type)
                check_type="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 --url <base_url> [--type <check_type>]"
                echo "Check types: http, api, comprehensive (default)"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    if [ -z "$url" ]; then
        log_error "URL not specified. Use --url flag."
        exit 1
    fi

    case "$check_type" in
        http)
            check_http_endpoint "$url"
            ;;
        api)
            check_api_health "$url"
            ;;
        comprehensive)
            comprehensive_check "$url"
            ;;
        *)
            log_error "Unknown check type: $check_type"
            exit 1
            ;;
    esac
}

# Run main if script is executed directly
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
