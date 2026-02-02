-- Performance indexes for reporting queries

-- Sales report indexes
CREATE INDEX IF NOT EXISTS idx_sales_invoices_branch_posted 
ON sales_invoices(branch_id, posted_at DESC) 
WHERE status = 'POSTED';

CREATE INDEX IF NOT EXISTS idx_sales_invoice_lines_sale_product 
ON sales_invoice_lines(sale_id, product_id);

CREATE INDEX IF NOT EXISTS idx_sales_invoices_company ON sales_invoices(company_id);

-- Inventory aging indexes
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_product_posted 
ON inventory_ledger(product_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_branch_posted 
ON inventory_ledger(branch_id, posted_at DESC);

-- Supplier performance indexes
CREATE INDEX IF NOT EXISTS idx_grn_headers_supplier_posted 
ON grn_headers(supplier_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_grn_headers_branch_posted 
ON grn_headers(branch_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_grn_headers_company ON grn_headers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company ON suppliers(company_id);

-- Staff productivity indexes
CREATE INDEX IF NOT EXISTS idx_sales_invoices_created_by_posted 
ON sales_invoices(created_by, posted_at DESC) 
WHERE status = 'POSTED';

-- Expiry risk indexes
CREATE INDEX IF NOT EXISTS idx_product_batches_expiry 
ON product_batches(expiry_date) 
WHERE is_expired = FALSE;

CREATE INDEX IF NOT EXISTS idx_product_batches_product_expiry ON product_batches(product_id, expiry_date);
