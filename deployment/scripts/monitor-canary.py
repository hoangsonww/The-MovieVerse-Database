#!/usr/bin/env python3
"""
Canary Deployment Monitoring Script
Monitors key metrics during canary deployment and determines if rollout should proceed
"""

import argparse
import time
import sys
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

try:
    import boto3
    from prometheus_client.parser import text_string_to_metric_families
except ImportError:
    print("Required packages not installed. Run: pip install boto3 prometheus-client")
    sys.exit(1)


class CanaryMonitor:
    def __init__(self, duration: int, error_threshold: float, latency_threshold: int):
        """
        Initialize canary monitor

        Args:
            duration: Monitoring duration in seconds
            error_threshold: Maximum acceptable error rate percentage
            latency_threshold: Maximum acceptable P99 latency in milliseconds
        """
        self.duration = duration
        self.error_threshold = error_threshold
        self.latency_threshold = latency_threshold
        self.cloudwatch = boto3.client('cloudwatch', region_name='us-east-1')

    def get_cloudwatch_metrics(self, metric_name: str, namespace: str,
                               dimensions: List[Dict], statistic: str) -> float:
        """Fetch metrics from CloudWatch"""
        try:
            response = self.cloudwatch.get_metric_statistics(
                Namespace=namespace,
                MetricName=metric_name,
                Dimensions=dimensions,
                StartTime=datetime.utcnow() - timedelta(minutes=5),
                EndTime=datetime.utcnow(),
                Period=300,
                Statistics=[statistic]
            )

            if response['Datapoints']:
                return response['Datapoints'][0][statistic]
            return 0.0
        except Exception as e:
            print(f"Error fetching CloudWatch metrics: {e}")
            return 0.0

    def get_error_rate(self, service_name: str, track: str) -> float:
        """Calculate error rate for canary deployment"""
        dimensions = [
            {'Name': 'ServiceName', 'Value': service_name},
            {'Name': 'Track', 'Value': track}
        ]

        total_requests = self.get_cloudwatch_metrics(
            'RequestCount',
            'AWS/ApplicationELB',
            dimensions,
            'Sum'
        )

        error_requests = self.get_cloudwatch_metrics(
            'HTTPCode_Target_5XX_Count',
            'AWS/ApplicationELB',
            dimensions,
            'Sum'
        )

        if total_requests == 0:
            return 0.0

        error_rate = (error_requests / total_requests) * 100
        return error_rate

    def get_latency(self, service_name: str, track: str) -> float:
        """Get P99 latency for canary deployment"""
        dimensions = [
            {'Name': 'ServiceName', 'Value': service_name},
            {'Name': 'Track', 'Value': track}
        ]

        latency = self.get_cloudwatch_metrics(
            'TargetResponseTime',
            'AWS/ApplicationELB',
            dimensions,
            'Average'
        )

        return latency * 1000  # Convert to milliseconds

    def check_health_endpoint(self, endpoint: str) -> Tuple[bool, int]:
        """Check health endpoint and return status and response time"""
        try:
            start_time = time.time()
            response = requests.get(endpoint, timeout=10)
            response_time = (time.time() - start_time) * 1000

            return response.status_code == 200, response_time
        except requests.exceptions.RequestException as e:
            print(f"Health check failed: {e}")
            return False, 0

    def monitor(self, service_name: str = 'movieverse') -> bool:
        """
        Monitor canary deployment metrics

        Returns:
            True if metrics are healthy, False otherwise
        """
        print(f"Starting canary monitoring for {self.duration} seconds...")
        print(f"Error threshold: {self.error_threshold}%")
        print(f"Latency threshold: {self.latency_threshold}ms")
        print("-" * 80)

        start_time = time.time()
        check_interval = 30  # Check every 30 seconds
        failed_checks = 0
        max_failed_checks = 3

        while (time.time() - start_time) < self.duration:
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            # Get metrics for canary
            canary_error_rate = self.get_error_rate(service_name, 'canary')
            canary_latency = self.get_latency(service_name, 'canary')

            # Get metrics for stable (baseline)
            stable_error_rate = self.get_error_rate(service_name, 'stable')
            stable_latency = self.get_latency(service_name, 'stable')

            print(f"\n[{current_time}] Metrics:")
            print(f"  Canary - Error Rate: {canary_error_rate:.2f}%, Latency: {canary_latency:.2f}ms")
            print(f"  Stable - Error Rate: {stable_error_rate:.2f}%, Latency: {stable_latency:.2f}ms")

            # Check if metrics are within acceptable range
            is_healthy = True

            if canary_error_rate > self.error_threshold:
                print(f"  ❌ Canary error rate ({canary_error_rate:.2f}%) exceeds threshold ({self.error_threshold}%)")
                is_healthy = False

            if canary_latency > self.latency_threshold:
                print(f"  ❌ Canary latency ({canary_latency:.2f}ms) exceeds threshold ({self.latency_threshold}ms)")
                is_healthy = False

            # Compare with stable
            if canary_error_rate > stable_error_rate * 1.5:
                print(f"  ⚠️  Canary error rate is 50% higher than stable")
                is_healthy = False

            if canary_latency > stable_latency * 1.3:
                print(f"  ⚠️  Canary latency is 30% higher than stable")
                is_healthy = False

            if is_healthy:
                print("  ✅ Metrics healthy")
                failed_checks = 0
            else:
                failed_checks += 1
                print(f"  ❌ Unhealthy metrics (Failed checks: {failed_checks}/{max_failed_checks})")

                if failed_checks >= max_failed_checks:
                    print("\n❌ Canary deployment failed health checks")
                    return False

            # Wait for next check
            time.sleep(check_interval)

        print("\n✅ Canary monitoring completed successfully")
        return True


def main():
    parser = argparse.ArgumentParser(description='Monitor canary deployment metrics')
    parser.add_argument('--duration', type=int, default=300,
                        help='Monitoring duration in seconds (default: 300)')
    parser.add_argument('--error-threshold', type=float, default=5.0,
                        help='Maximum acceptable error rate percentage (default: 5.0)')
    parser.add_argument('--latency-threshold', type=int, default=500,
                        help='Maximum acceptable P99 latency in ms (default: 500)')
    parser.add_argument('--service-name', type=str, default='movieverse',
                        help='Service name to monitor (default: movieverse)')

    args = parser.parse_args()

    monitor = CanaryMonitor(
        duration=args.duration,
        error_threshold=args.error_threshold,
        latency_threshold=args.latency_threshold
    )

    success = monitor.monitor(service_name=args.service_name)

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
