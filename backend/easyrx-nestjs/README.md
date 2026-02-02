# EazyRX - Enterprise Pharmacy Management System

A production-ready, multi-tenant pharmacy management system with offline-first capabilities and comprehensive regulatory compliance features.

## 🌟 Key Features

- **Multi-Tenancy**: Complete tenant isolation for multiple pharmacy chains
- **Offline-First**: Branch systems operate independently with automatic sync
- **FEFO Inventory**: First-Expired-First-Out batch selection
- **Atomic Transactions**: Zero stock discrepancies with pessimistic locking
- **Regulatory Compliance**: Audit trails for controlled substances
- **Accounting Integration**: Double-entry bookkeeping
- **Security Hardened**: JWT auth, RBAC, rate limiting, Bcrypt (12 rounds)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourorg/easyrx-nestjs.git
cd easyrx-nestjs

# Start with Docker
docker-compose up --build -d

# View logs
docker-compose logs -f easyrx-api

# Access API
curl http://localhost:3000/health

# Access Swagger docs
open http://localhost:3000/api-docs
```

## 📚 Documentation

- [Architecture Design](./docs/ARCHITECTURE.md) - System architecture and patterns
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment instructions
- [API Reference](./docs/API.md) - Complete API documentation

## 🛠️ Technology Stack

- **Backend**: NestJS 11 (TypeScript)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: TypeORM 0.3.28
- **Auth**: JWT (Passport)
- **Container**: Docker
- **CI/CD**: GitHub Actions

## 📦 Project Structure

```
easyrx-nestjs/
├── src/
│   ├── modules/
│   │   ├── companies/          # Multi-tenant companies
│   │   ├── branches/           # Branch management
│   │   ├── sales/              # POS transactions
│   │   ├── pharmacy/           # Prescriptions, customers
│   │   ├── purchase/           # Supplier, PO, GRN
│   │   ├── accounting/         # Chart of Accounts, Journal Entries
│   │   ├── inventory/          # Stock management, FEFO
│   │   ├── sync/               # Offline sync engine
│   │   └── security/           # Auth, RBAC, audit
│   ├── config/                 # Configuration
│   └── main.ts                 # Application entry
├── test/                       # E2E tests
├── docs/                       # Documentation
├── monitoring/                 # Prometheus config
├── docker-compose.yml
└── Dockerfile
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔐 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Role-Based Access Control (RBAC)
- ✅ Granular permissions (branch-level)
- ✅ Helmet security headers
- ✅ Multi-level rate limiting
- ✅ Environment variable validation
- ✅ Audit logging for all state changes
- ✅ Non-root container user

## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token

### Sales
- `POST /sales` - Create sale (POS)
- `GET /sales` - List sales

### Pharmacy
- `POST /pharmacy/customers` - Register customer
- `POST /pharmacy/prescriptions` - Create prescription

### Purchasing
- `POST /purchase/orders` - Create PO
- `POST /purchase/suppliers` - Register supplier

### Accounting
- `POST /accounting/entries` - Journal entry (balanced)

**Full API Reference**: [docs/API.md](./docs/API.md)

## 🌐 Deployment

### Docker Compose (Development)
```bash
docker-compose up -d
```

### Kubernetes (Production)
```bash
kubectl apply -f k8s/
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 📈 Monitoring

- Health checks: `/health`, `/health/ready`, `/health/live`
- Prometheus metrics: `/metrics` (when configured)
- Swagger docs: `/api-docs`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

Copyright © 2026 Each One Teach One. All rights reserved.

## 🆘 Support

- Email: support@easyrx.com
- Documentation: https://docs.easyrx.com
- Issues: https://github.com/yourorg/easyrx-nestjs/issues

---

**Built with ❤️ for pharmacies worldwide**
