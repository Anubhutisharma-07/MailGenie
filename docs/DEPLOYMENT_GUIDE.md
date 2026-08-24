# 🐳 MailGenie Cloud-Native & Container Deployment Guide

This guide details running and deploying the complete **MailGenie** application stack using Docker Compose and Kubernetes (K8s).

---

## 1. Local Development via Docker Compose

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Starting the Full Stack
```bash
# Clone the repository and navigate to root
cd MailGenie

# Spin up Postgres, Redis, Backend, and Frontend containers
docker compose up --build -d
```

### Accessing Services
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080/api/email/generate](http://localhost:8080/api/email/generate)
- **PostgreSQL Database:** `localhost:5432` (db: `mailgenie`, user: `postgres`, pass: `password`)
- **Redis Cache:** `localhost:6379`

### Stopping the Services
```bash
docker compose down -v
```

---

## 2. Kubernetes Cluster Deployment

Production-grade deployment manifests are provided under the `k8s/` directory.

### Applying Manifests
```bash
# 1. Apply Backend Deployment & ClusterIP Service
kubectl apply -f k8s/backend-deployment.yaml

# 2. Apply Frontend Deployment & LoadBalancer Service
kubectl apply -f k8s/frontend-deployment.yaml

# 3. Verify Pod and Service status
kubectl get pods -l 'app in (mailgenie-backend, mailgenie-frontend)'
kubectl get svc
```
