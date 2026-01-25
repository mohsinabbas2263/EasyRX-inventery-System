Final Table List + PK/FK (Locked v1.0)
Tenant & Org

companies (PK id)

branches (PK id, FK company_id)

terminals (PK id, FK company_id, FK branch_id)

Security / Identity

users (PK id, FK company_id, FK branch_id nullable)

roles (PK id, FK company_id)

user_roles (PK user_id+role_id)

(optional) permissions, role_permissions

Masters

products (PK id, FK company_id)

product_barcodes (PK id, FK company_id, FK product_id, UNIQUE(company_id, barcode))

suppliers (PK id, FK company_id)

customers (PK id, FK company_id)

patients (PK id, FK company_id)

Inventory (Ledger-based)

batches (PK id, FK company_id, FK product_id, UNIQUE(company_id, product_id, batch_no, expiry_date))

inventory_ledger_lines (PK id, FK company_id, FK branch_id, FK product_id, FK batch_id, FK created_by)

Purchasing

purchase_orders (PK id, FK company_id, FK branch_id, FK supplier_id)

purchase_order_lines (PK id, FK company_id, FK purchase_order_id, FK product_id)

grn_receipts (PK id, FK company_id, FK branch_id, FK supplier_id, FK purchase_order_id nullable, UNIQUE(company_id, idempotency_key) where not null)

grn_lines (PK id, FK company_id, FK grn_id, FK product_id, FK batch_id)

Sales

sales_invoices (PK id, FK company_id, FK branch_id, FK terminal_id nullable, FK customer_id nullable, FK patient_id nullable, UNIQUE(company_id, idempotency_key) where not null)

sales_invoice_lines (PK id, FK company_id, FK sales_invoice_id, FK product_id, FK batch_id)

payments (PK id, FK company_id, FK sales_invoice_id)

(optional) sales_returns

Dispensing & Compliance

prescriptions (PK id, FK company_id, FK branch_id, FK patient_id)

prescription_lines (PK id, FK company_id, FK prescription_id, FK product_id, FK batch_id nullable)

controlled_drug_register (PK id, FK company_id, FK branch_id, FK prescription_id nullable, FK product_id, FK logged_by)

Transfers

transfers (PK id, FK company_id, FK from_branch_id, FK to_branch_id, UNIQUE(company_id, idempotency_key) where not null)

transfer_lines (PK id, FK company_id, FK transfer_id, FK product_id, FK batch_id)

Accounting

chart_of_accounts (PK id, FK company_id, UNIQUE(company_id, code))

journal_entries (PK id, FK company_id, FK branch_id nullable)

journal_lines (PK id, FK company_id, FK journal_entry_id, FK account_id)

AI Docs

document_uploads, ai_extractions, ai_review_events

Sync + Audit

sync_inbox (PK id, UNIQUE(company_id, idempotency_key))

sync_outbox (local only)

audit_logs
