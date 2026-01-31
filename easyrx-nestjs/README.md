<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# EazyRX Backend - Hybrid SaaS Pharmacy Inventory System

Enterprise pharmacy inventory management system built with NestJS, PostgreSQL, and Redis.

## Features

### Core Modules

- **Security & Compliance** (Module 9)
  - JWT authentication with 24h tokens
  - Role-based access control (RBAC)
  - Immutable audit logging
  - Controlled drug tracking
- **Inventory Management** (Module 7)
  - Real-time stock ledger (append-only)
  - Batch/lot tracking with expiry management
  - FEFO (First-Expire-First-Out) batch picking
  - Multi-location bin tracking
  - Cycle counting & physical counts
  - Dead stock & near-expiry alerts
- **Reports & BI** (Module 8)
  - Sales dashboards (daily/weekly/monthly)
  - Inventory aging & slow-moving analysis
  - Supplier performance metrics
  - Staff productivity tracking
  - CSV/JSON export
  - Redis caching (5-min TTL)

### Key Capabilities

- Multi-tenant (company isolation)
- Multi-branch support
- Real-time permissions enforcement
- Tamper-proof audit trails
- Rate limiting on auth endpoints
- Complete TypeScript type safety

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Clone and install
npm install

# Copy env file
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migrate

# Start development server
npm run start:dev
```

### Docker Setup

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Run migrations
npm run migrate

# Start app
npm run start:dev
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login with email/password

### Inventory

- `GET /api/v1/inventory/stock` - Get current stock
- `GET /api/v1/inventory/stock/near-expiry` - Near-expiry batches
- `GET /api/v1/inventory/stock/dead-stock` - Dead stock report
- `POST /api/v1/inventory/movements` - Create stock movement
- `POST /api/v1/inventory/cycle-count` - Apply cycle count
- `POST /api/v1/inventory/adjustment` - Create adjustment

### Reports

- `GET /api/v1/reports/sales` - Sales dashboard
- `GET /api/v1/reports/inventory/expiry` - Expiry risk report
- `GET /api/v1/reports/inventory/aging` - Stock aging report
- `GET /api/v1/reports/purchase/supplier` - Supplier performance
- `GET /api/v1/reports/staff/productivity` - Staff productivity
- `GET /api/v1/reports/export` - CSV export

### Audit & Security

- `GET /api/v1/audit` - Audit logs
- `GET /api/v1/audit/export` - Export audit CSV
- `GET /api/v1/permissions` - List permissions
- `POST /api/v1/permissions/assign` - Assign permissions
- `GET /api/v1/users` - List users
- `PATCH /api/v1/users/:id/role` - Change user role

## Database Schema

### Core Tables

- `users` - System users with roles
- `user_permissions` - Granular permission assignments
- `products` - Product master
- `product_batches` - Batch/lot tracking
- `inventory_ledger` - Append-only stock movements
- `bin_locations` - Physical storage locations
- `sales_invoices` - Sales transactions
- `audit_logs` - Immutable audit trail

## Security

### Authentication

- JWT tokens (24h expiry, 7d refresh)
- Password hashing with bcrypt
- Token refresh mechanism

### Authorization

- Role-based access control (CASHIER, PHARMACIST, MANAGER, HO_ADMIN, ACCOUNTANT, AUDITOR)
- Permission-based endpoint protection
- Branch-level data isolation

### Audit

- All actions logged with user/IP/timestamp
- Immutable audit records (no updates/deletes)
- Automatic redaction of sensitive data
- CSV export for compliance

## Performance

### Caching

- Redis cache with 5-min TTL
- Automatic cache invalidation
- Dashboard query optimization

### Indexes

- Strategic database indexes on hot paths
- Ledger queries optimized for time-series
- Batch expiry indexes for FEFO

### Rate Limiting

- Login endpoint: 5 requests/min per IP
- Standard endpoints: 100 requests/min
- Burst protection on sensitive operations

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

### Database Seeding
To populate the database with initial data (Default Company, Admin User, etc.):

```bash
npm run seed
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Deployment

### Production Build (Manual)

```bash
npm run build
npm run start:prod
```

### Production Deployment (Docker)

We provide a production-ready `docker-compose.prod.yml` that orchestrates the App, Database, and Redis.

1. **Build and Run:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. **Run Migrations (Inside Container):**
   ```bash
   docker exec -it easyrx-api npm run migrate
   ```

3. **Seed Data (Inside Container):**
   ```bash
   docker exec -it easyrx-api npm run seed
   ```

### Environment Variables

Ensure your `.env` file (or CI/CD secrets) contains the following specific for production:

- `NODE_ENV=production`
- `JWT_SECRET` (Use a strong/long random string)
- `CORS_ORIGIN` (Your frontend domain, e.g., https://easyrx.com)

