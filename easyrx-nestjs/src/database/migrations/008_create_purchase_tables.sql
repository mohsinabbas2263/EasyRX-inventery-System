-- Purchase Orders
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    phone VARCHAR(50),
    email VARCHAR(200),
    address TEXT,
    lead_time_days INTEGER,
    return_policy TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    po_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    po_number VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    expected_date DATE,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, po_number)
);

CREATE TABLE IF NOT EXISTS purchase_order_lines (
    po_line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(po_id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    ordered_qty NUMERIC(14, 3) NOT NULL,
    purchase_unit VARCHAR(50),
    expected_unit_cost NUMERIC(14, 4),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- GRN Headers (Goods Received Notes)
CREATE TABLE IF NOT EXISTS grn_headers (
    grn_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    po_id UUID REFERENCES purchase_orders(po_id),
    invoice_no VARCHAR(100),
    received_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    posted_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grn_lines (
    grn_line_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_id UUID NOT NULL REFERENCES grn_headers(grn_id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    batch_id UUID REFERENCES product_batches(batch_id),
    received_qty NUMERIC(14, 3) NOT NULL,
    unit_cost NUMERIC(14, 4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_company ON purchase_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_grn_headers_branch_posted ON grn_headers(branch_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_grn_headers_supplier ON grn_headers(supplier_id);
