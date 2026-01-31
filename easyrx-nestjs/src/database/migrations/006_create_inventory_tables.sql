-- Bin Locations
CREATE TABLE IF NOT EXISTS bin_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    code VARCHAR(50) NOT NULL,
    description TEXT,
    bin_type VARCHAR(20) DEFAULT 'SHELF',
    is_cold_chain BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, code)
);

CREATE INDEX IF NOT EXISTS idx_bin_branch_code ON bin_locations(branch_id, code);

-- Inventory Ledger (Core append-only log)
CREATE TABLE IF NOT EXISTS inventory_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    batch_id UUID REFERENCES product_batches(batch_id),
    bin_id UUID REFERENCES bin_locations(id),
    movement_type VARCHAR(30) NOT NULL,
    qty_in NUMERIC(14, 3) DEFAULT 0,
    qty_out NUMERIC(14, 3) DEFAULT 0,
    reason VARCHAR(100),
    unit_cost NUMERIC(14, 4),
    reference_doc_type VARCHAR(50),
    reference_doc_id UUID,
    created_by UUID REFERENCES users(user_id),
    posted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_branch_product_batch ON inventory_ledger(branch_id, product_id, batch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_branch_posted ON inventory_ledger(branch_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_product_batch ON inventory_ledger(product_id, batch_id);

-- Inventory Configuration
CREATE TABLE IF NOT EXISTS inventory_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    min_qty NUMERIC(14, 3) DEFAULT 0,
    max_qty NUMERIC(14, 3),
    reorder_point NUMERIC(14, 3),
    safety_stock NUMERIC(14, 3),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(branch_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_config_branch_product ON inventory_config(branch_id, product_id);
