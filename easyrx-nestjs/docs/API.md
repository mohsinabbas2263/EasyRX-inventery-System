# EazyRX API Reference

## Base URL

```
Production: https://api.easyrx.com
Development: http://localhost:3000
```

## Authentication

All endpoints (except `/auth/*` and `/health/*`) require JWT authentication.

### Login

**POST** `/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "password123"
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh-token-uuid"
}
```

Include token in subsequent requests:
```
Authorization: Bearer {accessToken}
```

## API Endpoints

### Health Checks

#### GET `/health`
Public endpoint for service health status.

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T15:00:00.000Z",
  "uptime": 86400,
  "environment": "production"
}
```

#### GET `/health/ready`
Kubernetes readiness probe.

#### GET `/health/live`
Kubernetes liveness probe.

---

### Companies

#### POST `/companies`
Create a new company (multi-tenant).

**Permission**: `COMPANIES_CREATE`

Request:
```json
{
  "name": "ABC Pharmacy Chain",
  "subdomain": "abc",
  "registrationNumber": "REG123",
  "taxNumber": "TAX456",
  "email": "admin@abcpharmacy.com"
}
```

#### GET `/companies`
List all companies.

**Permission**: `COMPANIES_VIEW`

---

### Branches

#### POST `/branches`
Create a new branch.

**Permission**: `BRANCHES_CREATE`

Request:
```json
{
  "companyId": "uuid",
  "name": "Downtown Branch",
  "code": "DT01",
  "phone": "555-1234"
}
```

#### GET `/branches`
Get all branches for authenticated user's company.

**Permission**: `BRANCHES_VIEW`

---

### Sales

#### POST `/sales`
Create a new sale (POS transaction).

**Permission**: `SALES_CREATE`

Request:
```json
{
  "branchId": "uuid",
  "customerId": "uuid",
  "paymentMethod": "CASH",
  "lines": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 10.50,
      "discount": 0
    }
  ]
}
```

Response:
```json
{
  "saleId": "uuid",
  "saleNumber": "SI-202602010001",
  "saleDate": "2026-02-01T15:30:00.000Z",
  "netTotal": 21.00,
  "lines": [...]
}
```

#### GET `/sales`
List all sales for the company.

**Permission**: `SALES_VIEW`

Query params:
- `startDate`: ISO8601 date
- `endDate`: ISO8601 date
- `branchId`: Filter by branch

---

### Pharmacy

#### POST `/pharmacy/customers`
Register a new customer/patient.

**Permission**: `CUSTOMERS_CREATE`

Request:
```json
{
  "companyId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "cnic": "12345-1234567-1",
  "phone": "555-9876",
  "loyaltyPoints": 0
}
```

#### GET `/pharmacy/customers`
Get all customers.

**Permission**: `CUSTOMERS_VIEW`

#### POST `/pharmacy/prescribers`
Register a doctor/prescriber.

**Permission**: `PRESCRIBERS_CREATE`

Request:
```json
{
  "companyId": "uuid",
  "name": "Dr. Smith",
  "specialization": "General Physician",
  "licenseNumber": "LIC12345"
}
```

#### POST `/pharmacy/prescriptions`
Create a new prescription.

**Permission**: `PRESCRIPTIONS_CREATE`

Request:
```json
{
  "customerId": "uuid",
  "prescriberId": "uuid",
  "prescriptionDate": "2026-02-01",
  "lines": [
    {
      "productId": "uuid",
      "quantity": 30,
      "dosage": "500mg",
      "frequency": "Twice daily"
    }
  ]
}
```

---

### Purchase

#### POST `/purchase/suppliers`
Register a new supplier.

**Permission**: `SUPPLIERS_CREATE`

Request:
```json
{
  "companyId": "uuid",
  "name": "PharmaCorp Ltd",
  "contactPerson": "Jane Smith",
  "email": "orders@pharmacorp.com",
  "phone": "555-1111"
}
```

#### POST `/purchase/orders`
Create a purchase order.

**Permission**: `PURCHASE_ORDERS_CREATE`

Request:
```json
{
  "branchId": "uuid",
  "supplierId": "uuid",
  "orderDate": "2026-02-01",
  "expectedDeliveryDate": "2026-02-08",
  "lines": [
    {
      "productId": "uuid",
      "quantity": 100,
      "unitCost": 5.00
    }
  ]
}
```

---

### Accounting

#### POST `/accounting/coa`
Create a new account in Chart of Accounts.

**Permission**: `COA_CREATE`

Request:
```json
{
  "companyId": "uuid",
  "code": "1001",
  "name": "Cash in Hand",
  "type": "ASSET"
}
```

Types: `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`

#### POST `/accounting/entries`
Create a balanced journal entry.

**Permission**: `JOURNAL_ENTRIES_CREATE`

Request:
```json
{
  "branchId": "uuid",
  "entryDate": "2026-02-01",
  "description": "Daily sales posting",
  "lines": [
    {
      "accountId": "cash-uuid",
      "debit": 1000.00,
      "credit": 0
    },
    {
      "accountId": "sales-uuid",
      "debit": 0,
      "credit": 1000.00
    }
  ]
}
```

**Validation**: Total Debit MUST equal Total Credit.

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["quantity must be a positive number"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 429 Too Many Requests
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later"
}
```

## Rate Limits

- **Short-term**: 3 requests/second per IP
- **Long-term**: 100 requests/minute per IP

## Swagger Documentation

Interactive API documentation available at:
```
http://localhost:3000/api-docs
```

Features:
- Try out endpoints directly
- View request/response schemas
- Authentication support

---

**API Version**: 1.0  
**Last Updated**: February 2026
