#!/usr/bin/env bash
set -euo pipefail

KUBECONFIG=${KUBECONFIG:-}
NAMESPACE=${NAMESPACE:-movieverse}

kubectl apply -f kubernetes/base/
kubectl apply -f kubernetes/infra/
kubectl apply -f kubernetes/services/
kubectl apply -f kubernetes/edge/

kubectl apply -f MovieVerse-AI/k8s/configmap.yml
kubectl apply -f MovieVerse-AI/k8s/externalsecret.yml
kubectl apply -f MovieVerse-AI/k8s/pvc.yml
kubectl apply -f MovieVerse-AI/k8s/deployment.yml
kubectl apply -f MovieVerse-AI/k8s/service.yml
kubectl apply -f MovieVerse-AI/k8s/hpa.yml
kubectl apply -f MovieVerse-AI/k8s/cronjob.yml

kubectl rollout status deployment/movieverse-nginx -n "$NAMESPACE"
kubectl rollout status deployment/movieverse-ai-api -n "$NAMESPACE"
