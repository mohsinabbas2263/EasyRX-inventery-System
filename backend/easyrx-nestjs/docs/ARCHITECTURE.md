# EazyRX Architecture Design Document

## System Overview

EazyRX is a **hybrid SaaS pharmacy management system** designed for multi-tenant, multi-branch pharmacy operations with offline-first capabilities.

## Architecture Principles

1. **Multi-Tenancy**: Complete data isolation at company level
2. **Offline-First**: Branch systems operate independently with sync
3. **ACID Compliance**: All financial and stock transactions are atomic
4. **Zero Stock Errors**: Pessimistic locking prevents negative inventory
5. **Regulatory Compliance**: Audit trails for controlled substances

## Technology Stack

### Backend
- **Framework**: NestJS 11 (TypeScript)
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.28
- **Cache/Throttling**: Redis 7
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer

### Infrastructure
- **Containerization**: Docker multi-stage builds
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Health check endpoints (Kubernetes-compatible)

## System Architecture

```
┌─────────────────────────────────────────────────┐
│                 Load Balancer                    │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────┐              ┌────▼────┐
│  API   │              │   API   │
│ Server │              │ Server  │
│ (Node) │              │ (Node)  │
└───┬────┘              └────┬────┘
    │                        │
    └────────┬───────────────┘
             │
   ┌─────────▼──────────┐
   │   PostgreSQL 15    │
   │  (Primary + Replica)│
   └────────────────────┘
             │
   ┌─────────▼──────────┐
   │     Redis 7        │
   │ (Rate Limit Cache) │
   └────────────────────┘
```

## Data Model

### Core Entities (40+ Total)

#### Multi-Tenancy Layer
- `Company`: Tenant isolation root
- `Branch`: Physical locations

#### Security & Access
- `User`: System users
- `Permission`: Granular access control
- `UserPermission`: Branch-specific permissions
- `RefreshToken`: Token management
- `AuditLog`: Immutable audit trail

#### Supply Chain
- `Supplier`: Vendor management
- `PurchaseOrder`: PO with multi-line support
- `GoodsReceiptNote`: Stock receiving
- `ProductBatch`: FEFO-tracked inventory
- `InventoryLedger`: Stock movements

#### Sales & POS
- `SalesInvoice`: Transaction header
- `SalesInvoiceLine`: Line items with batch tracking
- `SalesReturn`: Return processing

#### Pharmacy Domain
- `Customer`: Patient records
- `Prescriber`: Doctor registry
- `Prescription`: Rx management
- `ControlledDispenseLog`: Regulatory compliance

#### Accounting
- `ChartOfAccount`: Financial accounts
- `JournalEntry`: Double-entry bookkeeping
- `JournalEntryLine`: Debit/Credit lines

#### Offline Sync
- `SyncQueue`: Priority-based sync with idempotency

## Business Logic Patterns

### 1. Atomic Stock Management

All stock movements use **pessimistic locking**:

```typescript
const batch = await manager.findOne(ProductBatch, {
  where: { batchId },
  lock: { mode: 'pessimistic_write' } // Row-level lock
});

// Update quantity atomically
batch.quantityOnHand = currentQty + delta;
await manager.save(batch);
```

### 2. FEFO Batch Selection

Ensures oldest stock is dispensed first:

```typescript
SELECT batch_id, quantity_on_hand, expiry_date
FROM product_batches
WHERE product_id = ? AND quantity_on_hand > 0
ORDER BY expiry_date ASC  -- Oldest first
```

### 3. Offline Sync with Idempotency

```typescript
// Client generates UUID before going offline
const sale = {
  localUuid: generateUUID(),
  lines: [...]
};

// Server checks for duplicates using localUuid
if (await isDuplicate(sale.localUuid)) {
  return existingSale; // Idempotent
}
```

## Security Architecture

### Authentication Flow

1. User submits credentials → `/auth/login`
2. System validates against bcrypt hash (12 rounds)
3. JWT issued with user, company, branch claims
4. RefreshToken stored for rotation

### Authorization (RBAC)

Granular permissions checked at every endpoint:

```typescript
@Permissions('SALES_CREATE')
async createSale() {
  // Only users with SALES_CREATE can execute
}
```

### Audit Trail

All state-changing operations logged:
- `userId`, `action`, `entityType`, `entityId`
- `beforeData`, `afterData` (JSONB)
- `ipAddress`, `userAgent`, `requestId`

## Scalability Considerations

### Database
- Connection pooling (TypeORM default: 10)
- Read replicas for reporting
- Partitioning by `company_id` for large tenants

### Caching
- Redis for rate limit counters
- Optional query result caching

### Horizontal Scaling
- Stateless API servers
- Session stored in JWT (no server-side storage)
- Database is bottleneck (use connection pooling)

## Deployment Architecture

### Production Environment

```yaml
services:
  easyrx-api:
    image: easyrx/api:latest
    replicas: 3  # Load balanced
    environment:
      - DATABASE_HOST=db-primary
      - REDIS_HOST=redis-cluster
    
  easyrx-db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    
  easyrx-redis:
    image: redis:7-alpine
```

### Monitoring & Observability

- **Health Checks**: `/health`, `/health/ready`, `/health/live`
- **Metrics**: Prometheus scraping (future)
- **Logs**: Structured JSON logging
- **Tracing**: Request ID tracking

## Disaster Recovery

1. **Database Backups**: Daily automated snapshots
2. **Point-in-Time Recovery**: WAL archiving
3. **Sync Queue Resilience**: Retry logic with exponential backoff
4. **Data Integrity**: Foreign key constraints, check constraints

---

**Document Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Production-Ready
