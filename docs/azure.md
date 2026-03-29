# Azure Deployment Guide

This guide covers deploying OpenSEO on Microsoft Azure.

## Architecture Overview

- **Compute**: Azure Container Apps (recommended) or AKS
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Storage**: Azure Blob Storage for backups
- **Load Balancer**: Azure Application Gateway
- **SSL**: Azure-managed certificates
- **DNS**: Azure DNS

## Deployment Options

### Option 1: Azure Container Apps (Recommended)

1. **Create Container Apps Environment**
```bash
az containerapp env create \
  --name openseo-env \
  --resource-group openseo-rg \
  --location eastus
```

2. **Push to ACR**
```bash
# Create container registry
az acr create \
  --name openseoregistry \
  --resource-group openseo-rg \
  --sku Basic

# Login and push
az acr login --name openseoregistry
docker tag openseo/app:latest openseoregistry.azurecr.io/openseo/app:v1
docker push openseoregistry.azurecr.io/openseo/app:v1
```

3. **Deploy Container App**
```bash
az containerapp create \
  --name openseo-app \
  --resource-group openseo-rg \
  --environment openseo-env \
  --image openseoregistry.azurecr.io/openseo/app:v1 \
  --cpu 0.5 \
  --memory 1Gi \
  --min-replicas 1 \
  --max-replicas 5 \
  --target-port 3000 \
  --ingress external \
  --registry-server openseoregistry.azurecr.io \
  --set-env-vars "NODE_ENV=production" \
  --secrets "database-url=$DB_URL" "redis-url=$REDIS_URL"
```

### Option 2: AKS (Kubernetes)

```bash
# Create AKS cluster
az aks create \
  --name openseo-cluster \
  --resource-group openseo-rg \
  --node-count 2 \
  --vm-set-type VirtualMachineScaleSets \
  --load-balancer-sku standard

# Get credentials
az aks get-credentials --name openseo-cluster --resource-group openseo-rg

# Deploy with Helm
helm install openseo ./kubernetes/helm/openseo \
  --set postgresql.enabled=false \
  --set redis.enabled=false
```

## Azure Database for PostgreSQL Setup

```bash
# Create server
az postgres server create \
  --name openseo-db \
  --resource-group openseo-rg \
  --location eastus \
  --admin-user openseo \
  --admin-password your_password \
  --sku-name B_Gen5_1 \
  --storage-size 51200

# Create database
az postgres db create \
  --name openseo \
  --resource-group openseo-rg \
  --server-name openseo-db

# Get connection string
az postgres server show \
  --name openseo-db \
  --resource-group openseo-rg \
  --query fullyQualifiedDomainName
```

## Azure Cache for Redis Setup

```bash
# Create Redis instance
az redis create \
  --name openseo-redis \
  --resource-group openseo-rg \
  --location eastus \
  --sku Standard \
  --vm-size C0

# Get connection string
az redis show \
  --name openseo-redis \
  --resource-group openseo-rg \
  --query hostName
```

## Application Gateway Setup

```bash
# Create public IP
az network public-ip create \
  --name openseo-pip \
  --resource-group openseo-rg \
  --allocation-method Static \
  --sku Standard

# Create application gateway
az network application-gateway create \
  --name openseo-gateway \
  --resource-group openseo-rg \
  --location eastus \
  --sku WAF_v2 \
  --public-ip-address openseo-pip \
  --backend-pool-name openseo-pool \
  --http-settings-name openseo-settings \
  --frontend-port-name frontend-port \
  --listener-name listener \
  --request-timeout 300

# Add backend
az network application-gateway address-pool create \
  --gateway-name openseo-gateway \
  --name openseo-pool \
  --resource-group openseo-rg \
  --addresses <container-app-fqdn>

# Enable SSL
az network application-gateway ssl-cert create \
  --name openseo-cert \
  --gateway-name openseo-gateway \
  --resource-group openseo-rg \
  --cert-file /path/to/cert.pem \
  --cert-password your_password
```

## Key Vault for Secrets

```bash
# Create Key Vault
az keyvault create \
  --name openseo-kv \
  --resource-group openseo-rg \
  --location eastus

# Store secrets
az keyvault secret set \
  --vault-name openseo-kv \
  --name database-url \
  --value "postgresql://openseo:password@server.postgres.database.azure.com:5432/openseo"

az keyvault secret set \
  --vault-name openseo-kv \
  --name redis-url \
  --value "openseo.redis.cache.windows.net:6380?ssl=true"
```

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| DATABASE_URL | PostgreSQL connection string | Key Vault |
| REDIS_URL | Redis connection string | Key Vault |
| NODE_ENV | Environment | Container App |

## Estimated Monthly Cost (100 users)

- Container Apps: $20-40 (execution-based)
- Azure Database PostgreSQL: $30-50 (Basic tier)
- Azure Cache Redis: $30-45 (Basic tier)
- Application Gateway: $40-60 (WAF_v2)
- Blob Storage (10GB): $2-3
- **Total**: ~$125-200/month
