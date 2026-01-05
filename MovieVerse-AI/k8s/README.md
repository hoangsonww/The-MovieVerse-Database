# MovieVerse AI Kubernetes Deployment

Apply these manifests in the MovieVerse namespace:

```bash
kubectl apply -f MovieVerse-AI/k8s/configmap.yml
kubectl apply -f MovieVerse-AI/k8s/externalsecret.yml
kubectl apply -f MovieVerse-AI/k8s/pvc.yml
kubectl apply -f MovieVerse-AI/k8s/deployment.yml
kubectl apply -f MovieVerse-AI/k8s/service.yml
kubectl apply -f MovieVerse-AI/k8s/hpa.yml
kubectl apply -f MovieVerse-AI/k8s/cronjob.yml
```

The AI API service will be available internally as `movieverse-ai-api.movieverse.svc.cluster.local:9000`.
