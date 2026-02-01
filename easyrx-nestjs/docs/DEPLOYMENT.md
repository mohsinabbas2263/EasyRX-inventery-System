# EazyRX Deployment Guide

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- PostgreSQL 15 (if not using Docker)
- Redis 7 (if not using Docker)
- Node.js 20+ (for local development)

## Quick Start (Docker)

### 1. Clone Repository

```bash
git clone https://github.com/yourorg/easyrx-nestjs.git
cd easyrx-nestjs
```

### 2. Configure Environment

Create `.env` file from template:

```bash
cp .env.production .env
```

**CRITICAL**: Update these values:

```env
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD_HERE
JWT_SECRET=YOUR_64_CHARACTER_MINIMUM_SECRET_HERE
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 3. Start Services

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f easyrx-api

# Check health
curl http://localhost:3000/health
```

### 4. Run Migrations

```bash
# Generate initial migration
docker-compose exec easyrx-api npm run typeorm migration:generate -- -n InitialSchema

# Run migrations
docker-compose exec easyrx-api npm run typeorm migration:run
```

### 5. Seed Initial Data

```bash
docker-compose exec easyrx-api npm run seed
```

This creates:
- Default admin user (`admin` / `admin123` - **CHANGE THIS**)
- Sample company and branch
- Basic permissions

## Production Deployment

### Environment Configuration

```env
NODE_ENV=production
PORT=3000

# Database (Use managed PostgreSQL in production)
DATABASE_HOST=your-db-host.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_USER=easyrx_prod
DATABASE_PASSWORD=<use-secrets-manager>
DATABASE_NAME=easyrx_production
DB_LOGGING=false

# Security
JWT_SECRET=<use-secrets-manager-64-chars-min>
ALLOWED_ORIGINS=https://app.easyrx.com,https://pos.easyrx.com

# Redis (Use managed Redis in production)
REDIS_HOST=your-redis.cache.amazonaws.com
REDIS_PORT=6379

# Business Configuration
NEAR_EXPIRY_DAYS=90
ALLOW_NEGATIVE_STOCK=false
LOG_LEVEL=info
```

### Docker Production Build

```bash
# Build production image
docker build -t easyrx/api:1.0.0 .

# Test locally
docker run -p 3000:3000 --env-file .env easyrx/api:1.0.0

# Push to registry
docker tag easyrx/api:1.0.0 your-registry/easyrx/api:1.0.0
docker push your-registry/easyrx/api:1.0.0
```

### Kubernetes Deployment (Optional)

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: easyrx-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: easyrx-api
  template:
    metadata:
      labels:
        app: easyrx-api
    spec:
      containers:
      - name: api
        image: your-registry/easyrx/api:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: easyrx-secrets
              key: db-password
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
```

Apply:

```bash
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

## Database Management

### Backup

```bash
# Automated daily backup
pg_dump -h localhost -U easyrx_admin easyrx_prod > backup-$(date +%Y%m%d).sql

# Restore
psql -h localhost -U easyrx_admin easyrx_prod < backup-20260201.sql
```

### Migrations

```bash
# Generate new migration
npm run typeorm migration:generate -- -n AddNewFeature

# Run pending migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

## Monitoring

### Health Checks

- **Liveness**: `GET /health/live` - Is the process running?
- **Readiness**: `GET /health/ready` - Can it accept traffic?
- **Health**: `GET /health` - Detailed status info

### API Documentation

Swagger UI available at:
```
http://localhost:3000/api-docs
```

### Logs

View application logs:

```bash
# Docker Compose
docker-compose logs -f easyrx-api

# Kubernetes
kubectl logs -f deployment/easyrx-api
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use secrets manager for JWT_SECRET and DATABASE_PASSWORD
- [ ] Enable HTTPS/TLS (use reverse proxy like Nginx)
- [ ] Configure CORS allowed origins
- [ ] Enable database connection encryption
- [ ] Set up firewall rules (only allow ports 443/80)
- [ ] Regular security updates (Docker base images)
- [ ] Enable audit logging for compliance
- [ ] Implement database backup rotation
- [ ] Use non-root user in containers (already configured)

## Troubleshooting

### Build Errors

If you encounter TypeScript errors during build:

```bash
# Clear cache
rm -rf dist node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
docker-compose exec easyrx-api npm run typeorm query "SELECT NOW()"

# Check PostgreSQL logs
docker-compose logs easyrx-db
```

### Performance Issues

1. **Check connection pool**: Default is 10, increase in TypeORM config
2. **Enable Redis caching**: For rarely-changing data
3. **Database indexing**: Review query logs, add indexes
4. **Horizontal scaling**: Add more API replicas

## Scaling Guide

### Vertical Scaling
- Increase `resources.limits` in Kubernetes
- Use larger EC2/VM instances

### Horizontal Scaling
- Add API replicas (stateless)
- Database read replicas for reporting
- Redis cluster for high availability

---

**Support**: support@easyrx.com  
**Documentation**: https://docs.easyrx.com
