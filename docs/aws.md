# AWS Deployment Guide

This guide covers deploying OpenSEO on Amazon Web Services (AWS).

## Architecture Overview

- **Compute**: ECS Fargate or EC2 (recommended: Fargate for auto-scaling)
- **Database**: RDS PostgreSQL 15
- **Cache**: ElastiCache Redis 7
- **Storage**: S3 for backups and assets
- **Load Balancer**: ALB (Application Load Balancer)
- **SSL**: ACM Certificate Manager
- **DNS**: Route 53

## Deployment Options

### Option 1: ECS Fargate (Recommended)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name openseo/app
```

2. **Build and Push Image**
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker build -t openseo/app .
docker tag openseo/app:latest $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openseo/app:latest
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openseo/app:latest
```

3. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name openseo-cluster
```

4. **Task Definition** (save as task-definition.json)
```json
{
  "family": "openseo",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [{
    "name": "openseo",
    "image": "$ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/openseo/app:latest",
    "essential": true,
    "portMappings": [{"containerPort": 3000}],
    "environment": [
      {"name": "NODE_ENV", "value": "production"},
      {"name": "PORT", "value": "3000"}
    ],
    "secrets": [
      {"name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:us-east-1:$ACCOUNT_ID:secret:openseo/db-url:DB_URL::"},
      {"name": "REDIS_URL", "valueFrom": "arn:aws:secretsmanager:us-east-1:$ACCOUNT_ID:secret:openseo/redis:REDIS_URL::"}
    ]
  }]
}
```

5. **Register Task Definition**
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

6. **Create Service**
```bash
aws ecs create-service --cluster openseo-cluster --service-name openseo --task-definition openseo --desired-count 2 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SG_ID]}"
```

### Option 2: EC2 with Docker Compose

```bash
# Launch EC2 instance (t3.medium recommended)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxx \
  --subnet-id subnet-xxxxx

# SSH and install Docker
sudo yum update -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone and start
git clone https://github.com/onetrustit-projects-repo/openseo.git
cd openseo/docker
cp .env.example .env
# Edit .env with RDS and ElastiCache endpoints
docker-compose up -d
```

## RDS PostgreSQL Setup

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier openseo-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 15.3 \
  --allocated-storage 20 \
  --master-username openseo \
  --master-user-password your_password \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name your-subnet-group
```

## ElastiCache Redis Setup

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id openseo-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-nodes 1 \
  --cache-subnet-group-name your-subnet-group \
  --security-group-ids sg-xxxxx
```

## ALB Configuration

1. Create Target Group
2. Configure health check on `/health`
3. Add listener on port 443 with ACM certificate
4. Register ECS tasks

## Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| DATABASE_URL | PostgreSQL connection string | Secrets Manager |
| REDIS_URL | Redis connection string | Secrets Manager |
| JWT_SECRET | JWT signing secret | Secrets Manager |
| ENCRYPTION_KEY | Data encryption key | Secrets Manager |

## Auto-Scaling

```bash
# Configure auto-scaling
aws autoscaling put-scaling-policy \
  --policy-name openseo-scaling \
  --auto-scaling-group-name openseo-asg \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://asg-config.json
```

## Backup Strategy

- RDS automated backups: Daily, 7-day retention
- S3 cross-region replication for backups
- ElastiCache Redis backups: Daily

## Estimated Monthly Cost (100 users)

- ECS Fargate: $25-40
- RDS t3.medium: $50-70
- ElastiCache t3.medium: $30-45
- ALB: $15-25
- S3 (10GB): $2-3
- Data transfer: $5-10
- **Total**: ~$130-200/month
