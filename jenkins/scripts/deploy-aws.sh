#!/usr/bin/env bash
set -euo pipefail

ENV_NAME=${ENV_NAME:-movieverse-prod}
AWS_REGION=${AWS_REGION:?AWS_REGION is required}

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-vpc \
  --template-file aws/cloudformation-vpc.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-ecr \
  --template-file aws/cloudformation-ecr.yml

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-rds \
  --template-file aws/cloudformation-rds.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-elasticache \
  --template-file aws/cloudformation-elasticache.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-opensearch \
  --template-file aws/cloudformation-opensearch.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-msk \
  --template-file aws/cloudformation-msk.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-mq \
  --template-file aws/cloudformation-mq.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name ${ENV_NAME}-eks \
  --template-file aws/cloudformation-eks.yml \
  --parameter-overrides EnvironmentName=$ENV_NAME
