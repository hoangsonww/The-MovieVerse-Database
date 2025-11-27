#!/usr/bin/env groovy

/**
 * MovieVerse Production CI/CD Pipeline
 * Supports Blue-Green and Canary Deployment Strategies
 */

pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOYMENT_STRATEGY',
            choices: ['blue-green', 'canary', 'rolling'],
            description: 'Select deployment strategy'
        )
        choice(
            name: 'ENVIRONMENT',
            choices: ['production', 'staging', 'development'],
            description: 'Target environment'
        )
        string(
            name: 'IMAGE_TAG',
            defaultValue: 'latest',
            description: 'Docker image tag to deploy'
        )
        booleanParam(
            name: 'RUN_TESTS',
            defaultValue: true,
            description: 'Run tests before deployment'
        )
        booleanParam(
            name: 'AUTO_APPROVE',
            defaultValue: false,
            description: 'Auto-approve deployment without manual intervention'
        )
    }

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        ECR_REPOSITORY = 'movieverse'
        ECS_CLUSTER = 'movieverse-prod-cluster'
        ECS_SERVICE = 'movieverse-prod-service-blue'
        KUBECTL_VERSION = '1.28.0'
        DOCKER_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_NAME = "${DOCKER_REGISTRY}/${ECR_REPOSITORY}"
        SLACK_CHANNEL = '#deployments'
        DATADOG_API_KEY = credentials('datadog-api-key')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '30'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }

    stages {
        stage('Initialize') {
            steps {
                script {
                    echo "=== MovieVerse Deployment Pipeline ==="
                    echo "Strategy: ${params.DEPLOYMENT_STRATEGY}"
                    echo "Environment: ${params.ENVIRONMENT}"
                    echo "Image Tag: ${params.IMAGE_TAG}"

                    // Set build description
                    currentBuild.description = "${params.DEPLOYMENT_STRATEGY} to ${params.ENVIRONMENT}"

                    // Send notification
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: 'good',
                        message: "Deployment started: ${env.JOB_NAME} #${env.BUILD_NUMBER}\nStrategy: ${params.DEPLOYMENT_STRATEGY}\nEnvironment: ${params.ENVIRONMENT}"
                    )
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    env.BUILD_TAG = "${params.IMAGE_TAG}-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        echo "Installing Node.js dependencies..."
                        npm ci --production=false
                    '''
                }
            }
        }

        stage('Run Tests') {
            when {
                expression { params.RUN_TESTS == true }
            }
            parallel {
                stage('Unit Tests') {
                    steps {
                        script {
                            sh '''
                                echo "Running unit tests..."
                                npm run test || true
                            '''
                        }
                    }
                }
                stage('Lint') {
                    steps {
                        script {
                            sh '''
                                echo "Running linter..."
                                npm run lint || true
                            '''
                        }
                    }
                }
                stage('Security Scan') {
                    steps {
                        script {
                            sh '''
                                echo "Running security audit..."
                                npm audit --production || true
                            '''
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${env.IMAGE_NAME}:${env.BUILD_TAG}"
                    sh """
                        docker build \
                            --build-arg BUILD_DATE=\$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                            --build-arg VCS_REF=${env.GIT_COMMIT_SHORT} \
                            --build-arg VERSION=${env.BUILD_TAG} \
                            -t ${env.IMAGE_NAME}:${env.BUILD_TAG} \
                            -t ${env.IMAGE_NAME}:latest \
                            .
                    """
                }
            }
        }

        stage('Scan Docker Image') {
            steps {
                script {
                    echo "Scanning Docker image for vulnerabilities..."
                    sh """
                        # Using Trivy for container scanning
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                            aquasec/trivy:latest image \
                            --severity HIGH,CRITICAL \
                            --exit-code 0 \
                            ${env.IMAGE_NAME}:${env.BUILD_TAG}
                    """
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    echo "Pushing Docker image to ECR..."
                    sh """
                        # Login to ECR
                        aws ecr get-login-password --region ${env.AWS_REGION} | \
                            docker login --username AWS --password-stdin ${env.DOCKER_REGISTRY}

                        # Push images
                        docker push ${env.IMAGE_NAME}:${env.BUILD_TAG}
                        docker push ${env.IMAGE_NAME}:latest

                        # Tag for environment
                        docker tag ${env.IMAGE_NAME}:${env.BUILD_TAG} ${env.IMAGE_NAME}:${params.ENVIRONMENT}
                        docker push ${env.IMAGE_NAME}:${params.ENVIRONMENT}
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    switch(params.DEPLOYMENT_STRATEGY) {
                        case 'blue-green':
                            deployBlueGreen()
                            break
                        case 'canary':
                            deployCanary()
                            break
                        case 'rolling':
                            deployRolling()
                            break
                        default:
                            error "Unknown deployment strategy: ${params.DEPLOYMENT_STRATEGY}"
                    }
                }
            }
        }

        stage('Smoke Tests') {
            steps {
                script {
                    echo "Running smoke tests..."
                    sh '''
                        # Wait for deployment to be ready
                        sleep 30

                        # Get service endpoint
                        ENDPOINT=$(aws elbv2 describe-load-balancers \
                            --region ${AWS_REGION} \
                            --query "LoadBalancers[?contains(LoadBalancerName, 'movieverse')].DNSName" \
                            --output text | head -1)

                        # Run health check
                        curl -f "http://${ENDPOINT}/health" || exit 1

                        echo "Smoke tests passed!"
                    '''
                }
            }
        }

        stage('Approval for Production') {
            when {
                allOf {
                    expression { params.ENVIRONMENT == 'production' }
                    expression { params.AUTO_APPROVE == false }
                }
            }
            steps {
                script {
                    timeout(time: 15, unit: 'MINUTES') {
                        input(
                            message: "Proceed with production deployment?",
                            ok: 'Deploy to Production',
                            submitter: 'admin,devops-team'
                        )
                    }
                }
            }
        }

        stage('Complete Deployment') {
            steps {
                script {
                    if (params.DEPLOYMENT_STRATEGY == 'blue-green') {
                        completeBlueGreenDeployment()
                    }

                    echo "Deployment completed successfully!"

                    // Create deployment marker in Datadog
                    sh """
                        curl -X POST "https://api.datadoghq.com/api/v1/events" \
                            -H "DD-API-KEY: ${env.DATADOG_API_KEY}" \
                            -H "Content-Type: application/json" \
                            -d '{
                                "title": "MovieVerse Deployment",
                                "text": "Deployed version ${env.BUILD_TAG} to ${params.ENVIRONMENT}",
                                "tags": ["environment:${params.ENVIRONMENT}", "service:movieverse", "deployment:${params.DEPLOYMENT_STRATEGY}"]
                            }'
                    """
                }
            }
        }
    }

    post {
        success {
            script {
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'good',
                    message: """
                        ✅ Deployment Successful!
                        Job: ${env.JOB_NAME}
                        Build: #${env.BUILD_NUMBER}
                        Strategy: ${params.DEPLOYMENT_STRATEGY}
                        Environment: ${params.ENVIRONMENT}
                        Version: ${env.BUILD_TAG}
                    """.stripIndent()
                )
            }
        }
        failure {
            script {
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: 'danger',
                    message: """
                        ❌ Deployment Failed!
                        Job: ${env.JOB_NAME}
                        Build: #${env.BUILD_NUMBER}
                        Strategy: ${params.DEPLOYMENT_STRATEGY}
                        Environment: ${params.ENVIRONMENT}
                        Check logs: ${env.BUILD_URL}
                    """.stripIndent()
                )

                // Trigger rollback if in production
                if (params.ENVIRONMENT == 'production') {
                    echo "Initiating automatic rollback..."
                    rollback()
                }
            }
        }
        always {
            cleanWs()
        }
    }
}

// ========== DEPLOYMENT FUNCTIONS ==========

def deployBlueGreen() {
    echo "Executing Blue-Green Deployment..."

    sh """
        #!/bin/bash
        set -e

        # Determine current active environment
        CURRENT_TARGET=\$(aws elbv2 describe-target-groups \
            --region ${env.AWS_REGION} \
            --names movieverse-prod-TG-Blue \
            --query 'TargetGroups[0].TargetGroupArn' \
            --output text)

        LISTENER_ARN=\$(aws elbv2 describe-listeners \
            --region ${env.AWS_REGION} \
            --load-balancer-arn ${env.ALB_ARN} \
            --query 'Listeners[?Port==`80`].ListenerArn' \
            --output text)

        CURRENT_RULE=\$(aws elbv2 describe-rules \
            --region ${env.AWS_REGION} \
            --listener-arn \${LISTENER_ARN} \
            --query 'Rules[0].Actions[0].TargetGroupArn' \
            --output text)

        # Determine which environment is active
        if [[ "\${CURRENT_RULE}" == *"Blue"* ]]; then
            ACTIVE="blue"
            INACTIVE="green"
            echo "Current active: BLUE, deploying to: GREEN"
        else
            ACTIVE="green"
            INACTIVE="blue"
            echo "Current active: GREEN, deploying to: BLUE"
        fi

        # Update task definition for inactive environment
        aws ecs register-task-definition \
            --region ${env.AWS_REGION} \
            --cli-input-json file://deployment/configs/task-definition-\${INACTIVE}.json

        # Update ECS service with new task definition
        aws ecs update-service \
            --region ${env.AWS_REGION} \
            --cluster ${env.ECS_CLUSTER} \
            --service movieverse-prod-service-\${INACTIVE} \
            --task-definition movieverse-prod-task-\${INACTIVE} \
            --force-new-deployment

        # Wait for service to be stable
        aws ecs wait services-stable \
            --region ${env.AWS_REGION} \
            --cluster ${env.ECS_CLUSTER} \
            --services movieverse-prod-service-\${INACTIVE}

        echo "Inactive environment (\${INACTIVE}) updated and healthy"
    """
}

def completeBlueGreenDeployment() {
    echo "Completing Blue-Green deployment - switching traffic..."

    sh """
        #!/bin/bash
        set -e

        # Use AWS CodeDeploy to switch traffic
        DEPLOYMENT_ID=\$(aws deploy create-deployment \
            --region ${env.AWS_REGION} \
            --application-name movieverse-prod-app \
            --deployment-group-name movieverse-prod-deployment-group \
            --deployment-config-name CodeDeployDefault.ECSAllAtOnce \
            --query 'deploymentId' \
            --output text)

        echo "CodeDeploy Deployment ID: \${DEPLOYMENT_ID}"

        # Wait for deployment to complete
        aws deploy wait deployment-successful \
            --region ${env.AWS_REGION} \
            --deployment-id \${DEPLOYMENT_ID}

        echo "Traffic successfully switched to new environment"
    """
}

def deployCanary() {
    echo "Executing Canary Deployment..."

    sh """
        #!/bin/bash
        set -e

        # Update canary deployment
        kubectl set image deployment/movieverse-canary \
            movieverse-app=${env.IMAGE_NAME}:${env.BUILD_TAG} \
            -n movieverse

        # Wait for rollout
        kubectl rollout status deployment/movieverse-canary -n movieverse --timeout=5m

        echo "Canary deployment updated"
        echo "Monitoring canary for 5 minutes..."

        # Monitor canary metrics
        python3 deployment/scripts/monitor-canary.py \
            --duration 300 \
            --error-threshold 5 \
            --latency-threshold 500

        CANARY_STATUS=\$?

        if [ \${CANARY_STATUS} -eq 0 ]; then
            echo "Canary metrics healthy - proceeding with rollout"

            # Gradually increase canary traffic
            for WEIGHT in 25 50 75 100; do
                echo "Increasing canary traffic to \${WEIGHT}%"
                kubectl patch ingress movieverse-canary \
                    -n movieverse \
                    --type=json \
                    -p='[{"op": "replace", "path": "/metadata/annotations/nginx.ingress.kubernetes.io~1canary-weight", "value": "'\${WEIGHT}'"}]'

                sleep 120

                # Check metrics at each stage
                python3 deployment/scripts/monitor-canary.py \
                    --duration 60 \
                    --error-threshold 5 \
                    --latency-threshold 500

                if [ \$? -ne 0 ]; then
                    echo "Canary metrics degraded at \${WEIGHT}% - initiating rollback"
                    rollback
                    exit 1
                fi
            done

            # Promote canary to stable
            kubectl set image deployment/movieverse-stable \
                movieverse-app=${env.IMAGE_NAME}:${env.BUILD_TAG} \
                -n movieverse

            kubectl rollout status deployment/movieverse-stable -n movieverse --timeout=10m

            # Scale down canary
            kubectl scale deployment/movieverse-canary --replicas=1 -n movieverse

            echo "Canary successfully promoted to stable"
        else
            echo "Canary metrics unhealthy - aborting deployment"
            rollback
            exit 1
        fi
    """
}

def deployRolling() {
    echo "Executing Rolling Deployment..."

    sh """
        #!/bin/bash
        set -e

        # Update ECS service with rolling update
        aws ecs update-service \
            --region ${env.AWS_REGION} \
            --cluster ${env.ECS_CLUSTER} \
            --service ${env.ECS_SERVICE} \
            --force-new-deployment \
            --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100,deploymentCircuitBreaker={enable=true,rollback=true}"

        # Wait for service to stabilize
        aws ecs wait services-stable \
            --region ${env.AWS_REGION} \
            --cluster ${env.ECS_CLUSTER} \
            --services ${env.ECS_SERVICE}

        echo "Rolling deployment completed"
    """
}

def rollback() {
    echo "Initiating rollback procedure..."

    sh """
        #!/bin/bash
        set -e

        case "${params.DEPLOYMENT_STRATEGY}" in
            blue-green)
                echo "Rolling back blue-green deployment..."
                # Switch back to previous environment
                aws deploy stop-deployment \
                    --region ${env.AWS_REGION} \
                    --deployment-id \${DEPLOYMENT_ID} \
                    --auto-rollback-enabled
                ;;
            canary)
                echo "Rolling back canary deployment..."
                # Scale down canary to 0
                kubectl scale deployment/movieverse-canary --replicas=0 -n movieverse
                # Reset ingress weight
                kubectl patch ingress movieverse-canary \
                    -n movieverse \
                    --type=json \
                    -p='[{"op": "replace", "path": "/metadata/annotations/nginx.ingress.kubernetes.io~1canary-weight", "value": "0"}]'
                ;;
            rolling)
                echo "Rolling back to previous task definition..."
                aws ecs update-service \
                    --region ${env.AWS_REGION} \
                    --cluster ${env.ECS_CLUSTER} \
                    --service ${env.ECS_SERVICE} \
                    --task-definition movieverse-prod-task:PREVIOUS
                ;;
        esac

        echo "Rollback completed"
    """
}
