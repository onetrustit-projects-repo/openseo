# Google Cloud Platform Deployment Guide

This guide covers deploying OpenSEO on Google Cloud Platform (GCP).

## Architecture Overview

- **Compute**: Cloud Run (recommended) or GKE
- **Database**: Cloud SQL PostgreSQL 15
- **Cache**: Memorystore Redis 7
- **Storage**: Cloud Storage for backups
- **Load Balancer**: Cloud Load Balancing with SSL
- **SSL**: Google-managed certificates
- **DNS**: Cloud DNS

## Deployment Options

### Option 1: Cloud Run (Recommended)

1. **Build and Push to Artifact Registry**
```bash
gcloud artifacts repositories create openseo \
  --repository-format=docker \
  --location=us-central1

gcloud auth configure-docker us-central1-docker.pkg.dev

docker build -t us-central1-docker.pkg.dev/$PROJECT_ID/openseo/app:v1 .
docker push us-central1-docker.pkg.dev/$PROJECT_ID/openseo/app:v1
```

2. **Deploy to Cloud Run**
```bash
gcloud run deploy openseo \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/openseo/app:v1 \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --port 3000 \
  --set-env-vars "NODE_ENV=production,PORT=3000" \
  --set-secrets "DATABASE_URL=openseo-db-url:latest,REDIS_URL=openseo-redis:latest" \
  --vpc-connector openseo-vpc-connector
```

3. **Configure SQL Connection**
```bash
gcloud run services add-vpc-connection openseo \
  --vpc-connector openseo-vpc-connector \
  --subnet default
```

### Option 2: GKE (Kubernetes)

```bash
# Create GKE cluster
gcloud container clusters create openseo-cluster \
  --zone us-central1-a \
  --num-nodes 2 \
  --machine-type e2-medium

# Get credentials
gcloud container clusters get-credentials openseo-cluster

# Deploy using Helm
helm install openseo ./kubernetes/helm/openseo \
  --set postgresql.enabled=false \
  --set redis.enabled=false \
  --set env.DATABASE_URL=$DATABASE_URL \
  --set env.REDIS_URL=$REDIS_URL
```

## Cloud SQL PostgreSQL Setup

```bash
# Create instance
gcloud sql instances create openseo-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-size=20GB \
  --storage-auto-increase

# Create database
gcloud sql databases create openseo --instance=openseo-db

# Create user
gcloud sql users create openseo \
  --instance=openseo-db \
  --password=your_password

# Get connection string
gcloud sql instances describe openseo-db --format="value(connectionName)"
```

## Memorystore Redis Setup

```bash
# Create Redis instance
gcloud redis instances create openseo-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0 \
  --tier=STANDARD_HA

# Get host
gcloud redis instances describe openseo-redis --region=us-central1 --format="value(host)"
```

## Secret Manager Configuration

```bash
# Store secrets
echo -n "postgresql://openseo:password@/openseo?host=/cloudsql/project:region:instance" | \
  gcloud secrets create openseo-db-url --data-file=-

echo -n "redis://host:6379" | \
  gcloud secrets create openseo-redis --data-file=-
```

## Load Balancer Setup

```bash
# Create serverless NEG for Cloud Run
gcloud compute network-endpoint-groups create openseo-neg \
  --region=us-central1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=openseo

# Create backend service
gcloud compute backend-services create openseo-backend \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED

gcloud compute backend-services add-backend openseo-backend \
  --global \
  --network-endpoint-group=openseo-neg \
  --network-endpoint-group-region=us-central1

# Create URL map
gcloud compute url-maps create openseo-lb \
  --default-service=openseo-backend

# Create managed SSL certificate
gcloud compute ssl-certificates create openseo-cert \
  --domains=openseo.yourdomain.com

# Create HTTPS proxy
gcloud compute target-https-proxies create openseo-https-proxy \
  --url-map=openseo-lb \
  --ssl-certificates=openseo-cert

# Create forwarding rule
gcloud compute forwarding-rules create openseo-https-rule \
  --global \
  --target-https-proxy=openseo-https-proxy \
  --ports=443
```

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| DATABASE_URL | PostgreSQL connection string | Secret Manager |
| REDIS_URL | Redis connection string | Secret Manager |
| NODE_ENV | Environment | Cloud Run |

## Estimated Monthly Cost (100 users)

- Cloud Run: $15-30 (request-based)
- Cloud SQL f1-micro: $25-35
- Memorystore Redis: $35-50
- Cloud Load Balancing: $20-30
- Cloud Storage (10GB): $2-3
- **Total**: ~$100-150/month
