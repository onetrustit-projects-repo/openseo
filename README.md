# OpenSEO Docker Containerization and Self-Hosting Suite

Official Docker images and Docker Compose setup for easy self-hosting of OpenSEO.

## Features

- 🚀 **One-Command Deployment** - Get started with a single `docker-compose up`
- 🔒 **Secure by Default** - Non-root users, read-only filesystems, security headers
- 📊 **Included Dependencies** - PostgreSQL 15 and Redis 7 included
- 🌐 **Automatic HTTPS** - Let's Encrypt integration for production
- 🔄 **Migration Scripts** - Move between cloud and self-hosted seamlessly
- ☸️ **Kubernetes Ready** - Helm charts for K8s deployment
- ☁️ **Multi-Cloud Docs** - AWS, GCP, and Azure deployment guides

## Quick Start

### Prerequisites

- Docker 20.10+ and Docker Compose v2
- Domain name (for production with HTTPS)
- 2GB RAM minimum, 4GB recommended

### Development Setup

```bash
# Clone the repository
git clone https://github.com/onetrustit-projects-repo/openseo.git
cd openseo

# Copy environment template
cp docker/.env.example docker/.env

# Start all services
cd docker && docker-compose up -d

# View logs
docker-compose logs -f app

# Access at http://localhost:3000
```

### Production Setup with HTTPS

```bash
# Edit .env with your production settings
vim docker/.env

# Generate SSL certificates (requires domain pointing to server)
mkdir -p docker/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -out docker/ssl/cert.pem -keyout docker/ssl/key.pem \
  -subj "/C=US/ST=State/L=City/O=OpenSEO/CN=your-domain.com"

# Start with nginx
cd docker && docker-compose -f docker-compose.yml up -d

# Access at https://your-domain.com
```

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Nginx     │────▶│     App     │
└─────────────┘     │   (SSL)     │     │   (API)     │
                    └─────────────┘     └──────┬──────┘
                                               │
                    ┌─────────────┐     ┌──────▼──────┐
                    │   Let's     │     │  PostgreSQL │
                    │   Encrypt   │     │    (DB)    │
                    └─────────────┘     └─────────────┘
                                               │
                    ┌─────────────┐     ┌──────▼──────┐
                    │   Redis     │◀────│   Cache     │
                    │   (Cache)   │     └─────────────┘
                    └─────────────┘
```

## Migration

### Cloud to Self-Hosted

```bash
# On your cloud instance
CLOUD_API_URL=https://api.openseo.io
CLOUD_API_KEY=your_api_key
./scripts/migrate-to-selfhosted.sh

# Copy export to your server
scp -r migration-export/* user@your-server:/path/

# On your self-hosted server
./scripts/import-migration.sh
```

### Self-Hosted to Cloud

```bash
# Export from self-hosted
./scripts/migrate-to-selfhosted.sh

# Upload to cloud
CLOUD_API_URL=https://api.openseo.io
CLOUD_API_KEY=your_cloud_api_key
./scripts/migrate-to-cloud.sh
```

## Kubernetes Deployment

```bash
# Add Helm repo
helm repo add openseo https://charts.openseo.io

# Install
helm install openseo openseo/openseo \
  --set postgresql.enabled=true \
  --set redis.enabled=true

# Or use local chart
cd kubernetes/helm/openseo
helm install openseo . \
  --set postgresql.enabled=true \
  --set redis.enabled=true
```

## Configuration Reference

| Variable | Description | Default |
|----------|-------------|---------|
| APP_PORT | Application port | 3000 |
| POSTGRES_USER | Database user | openseo |
| POSTGRES_PASSWORD | Database password | changeme |
| POSTGRES_DB | Database name | openseo |
| REDIS_PORT | Redis port | 6379 |
| JWT_SECRET | JWT signing secret | (required) |
| ENCRYPTION_KEY | Data encryption key | (required) |
| HTTP_PORT | HTTP port | 80 |
| HTTPS_PORT | HTTPS port | 443 |

## Cloud Platform Deployment

- [AWS Deployment Guide](docs/aws.md)
- [GCP Deployment Guide](docs/gcp.md)
- [Azure Deployment Guide](docs/azure.md)

## Security Features

- Non-root container user
- Read-only root filesystem option
- Security headers (HSTS, CSP, etc.)
- Rate limiting
- Secret management via environment variables
- Regular base image updates

## Maintenance

### Backup Database

```bash
docker exec openseo-postgres pg_dump -U openseo openseo > backup_$(date +%Y%m%d).sql
```

### Update Container

```bash
docker-compose pull
docker-compose up -d
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

---

Task: 1f17ccbf-129c-49ce-a773-6b06e9b17aed
