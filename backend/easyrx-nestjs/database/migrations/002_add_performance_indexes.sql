-- Performance indexes for products
CREATE INDEX IF NOT EXISTS idx_products_company_barcode 
  ON products(company_id, barcode_1d);

CREATE INDEX IF NOT EXISTS idx_products_active 
  ON products(company_id, is_active) 
  WHERE is_active = true;

-- Performance indexes for batches
CREATE INDEX IF NOT EXISTS idx_batches_expiry 
  ON product_batches(branch_id, expiry_date) 
  WHERE quantity_on_hand > 0;

CREATE INDEX IF NOT EXISTS idx_batches_product_lookup 
  ON product_batches(product_id, branch_id);

-- Performance indexes for inventory ledger
CREATE INDEX IF NOT EXISTS idx_inventory_ledger_lookup 
  ON inventory_ledger(branch_id, product_id, posted_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_ledger_document 
  ON inventory_ledger(document_type, document_id);

CREATE INDEX IF NOT EXISTS idx_stock_lookup 
  ON inventory_ledger(product_id, batch_id, branch_id);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username 
  ON users(username);

CREATE INDEX IF NOT EXISTS idx_users_company 
  ON users(company_id);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_search 
  ON audit_logs(company_id, user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity 
  ON audit_logs(entity_type, entity_id);
