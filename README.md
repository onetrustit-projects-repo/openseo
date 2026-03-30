# OpenSEO Docker Containerization and Self-Hosting Suite

Official Docker images and Docker Compose setup for easy self-hosting of OpenSEO. Supports one-command deployment, automatic HTTPS, PostgreSQL, Redis, and migration between cloud and self-hosted.

## Features

- 🚀 **One-Command Deployment** - Get started with a single `docker-compose up`
- 🔒 **Secure by Default** - Non-root users, security headers, read-only filesystems
- 📊 **Included Dependencies** - PostgreSQL 15 and Redis 7 included
- 🌐 **Automatic HTTPS** - Let's Encrypt integration for production
- 🔄 **Migration Scripts** - Move between cloud and self-hosted seamlessly
- ☸️ **Kubernetes Ready** - Helm charts for K8s deployment
- ☁️ **Multi-Cloud Docs** - AWS, GCP, and Azure deployment guides

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Nginx (SSL)                          │
│                    ports: 80, 443                           │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│     App     │      │  PostgreSQL │      │    Redis    │
│   (API)    │      │     (DB)    │      │   (Cache)  │
│   :3000    │      │    :5432    │      │    :6379   │
└─────────────┘      └─────────────┘      └─────────────┘
```

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
cd docker && docker-compose up -d

# Access at https://your-domain.com
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_PORT` | Application port | 3000 |
| `POSTGRES_USER` | Database user | openseo |
| `POSTGRES_PASSWORD` | Database password | changeme |
| `POSTGRES_DB` | Database name | openseo |
| `POSTGRES_PORT` | Database port | 5432 |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `ENCRYPTION_KEY` | Data encryption key | (required) |
| `API_BASE_URL` | Public API URL | http://localhost:3000 |
| `FRONTEND_URL` | Public frontend URL | http://localhost:5173 |
| `HTTP_PORT` | HTTP port | 80 |
| `HTTPS_PORT` | HTTPS port | 443 |
| `LETSENCRYPT_EMAIL` | Let's Encrypt email | (required for HTTPS) |
| `LETSENCRYPT_DOMAIN` | Domain for SSL | (required for HTTPS) |

### Required Security Variables

```bash
# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
```

## Docker Compose Services

### App
Main application container running the OpenSEO API.

- Port: 3000 (configurable)
- Health check: `/health` endpoint
- Non-root user: `openseo`

### PostgreSQL
Database for persistent storage.

- Version: 15-alpine
- Port: 5432 (configurable)
- Volume: `postgres-data`
- Init script: `init-db.sh`
- Extensions: uuid-ossp

### Redis
Cache for session storage and rate limiting.

- Version: 7-alpine
- Port: 6379 (configurable)
- Volume: `redis-data`
- Max memory: 256mb with allkeys-lru eviction

### Nginx
Reverse proxy with SSL termination.

- Version: alpine
- Ports: 80, 443
- Rate limiting: 100 requests/minute
- Gzip compression enabled
- Security headers included

### Certbot
Let's Encrypt certificate management.

- Auto-renewal every 6 hours
- Volume: `./ssl` for certificates

## Security Features

- **Non-root containers**: All services run as non-root users
- **Read-only filesystem**: Production containers use read-only root
- **Security headers**: HSTS, CSP, X-Frame-Options, etc.
- **Rate limiting**: API endpoints limited to 100 req/min
- **Secret management**: All secrets via environment variables
- **SSL/TLS**: Modern cipher suites, TLS 1.2/1.3 only

## Migration

### Cloud to Self-Hosted

```bash
# On your cloud instance
export CLOUD_API_URL=https://api.openseo.io
export CLOUD_API_KEY=your_api_key
export EXPORT_DIR=./migration-export

# Run export
./scripts/migrate-to-selfhosted.sh

# Copy export to your server
scp -r migration-export/* user@your-server:/path/

# On your self-hosted server
export SELF_HOSTED_URL=http://localhost:3000
export EXPORT_DIR=./migration-export
./scripts/import-migration.sh
```

### Self-Hosted to Cloud

```bash
# Export from self-hosted
export SELF_HOSTED_URL=http://localhost:3000
export EXPORT_DIR=./migration-export
./scripts/migrate-to-selfhosted.sh

# Upload to cloud
export CLOUD_API_URL=https://api.openseo.io
export CLOUD_API_KEY=your_cloud_api_key
./scripts/migrate-to-cloud.sh
```

## Kubernetes Deployment

### Helm Chart

```bash
# Add Helm repo
helm repo add openseo https://charts.openseo.io
helm repo update

# Install with dependencies
helm install openseo openseo/openseo \
  --set postgresql.enabled=true \
  --set redis.enabled=true

# Custom installation
helm install openseo ./kubernetes/helm/openseo \
  --set postgresql.enabled=true \
  --set redis.enabled=true \
  --set ingress.enabled=true \
  --set ingress.host=openseo.example.com
```

### Values Reference

See [values.yaml](kubernetes/helm/openseo/values.yaml) for full configuration options.

## Cloud Platform Deployment

- [AWS Deployment Guide](docs/aws.md) - ECS Fargate, RDS, ElastiCache
- [GCP Deployment Guide](docs/gcp.md) - GKE, Cloud SQL, Memorystore
- [Azure Deployment Guide](docs/azure.md) - Container Apps, Azure Database

## Maintenance

### Backup Database

```bash
# Create backup
docker exec openseo-postgres pg_dump -U openseo openseo > backup_$(date +%Y%m%d).sql

# Restore backup
docker exec -i openseo-postgres psql -U openseo openseo < backup_20240115.sql
```

### Update Containers

```bash
cd docker
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
docker-compose logs -f redis
```

### Stop Services

```bash
cd docker
docker-compose down

# Remove volumes (deletes data!)
docker-compose down -v
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs app

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Database connection failed

```bash
# Check postgres health
docker-compose ps postgres

# Restart postgres
docker-compose restart postgres
```

### SSL certificate issues

```bash
# Check certbot logs
docker-compose logs certbot

# Force renewal
docker-compose exec certbot certbot renew --force-renewal
```

## Project Structure

```
├── docker/
│   ├── Dockerfile           # Multi-stage build
│   ├── docker-compose.yml   # Service orchestration
│   ├── nginx.conf          # Reverse proxy config
│   ├── init-db.sh          # Database initialization
│   └── .env.example        # Environment template
├── docs/
│   ├── aws.md              # AWS deployment guide
│   ├── gcp.md              # GCP deployment guide
│   └── azure.md            # Azure deployment guide
├── kubernetes/
│   └── helm/openseo/
│       ├── Chart.yaml       # Helm chart definition
│       ├── values.yaml      # Default values
│       └── templates/       # K8s templates
├── scripts/
│   ├── migrate-to-selfhosted.sh   # Cloud → Self-hosted
│   ├── migrate-to-cloud.sh        # Self-hosted → Cloud
│   └── import-migration.sh       # Import data
└── README.md
```

## Version History

- **1.0.0**: Initial release with Docker, Kubernetes, and migration support

## Task

Task ID: 1f17ccbf-129c-49ce-a773-6b06e9b17aed
