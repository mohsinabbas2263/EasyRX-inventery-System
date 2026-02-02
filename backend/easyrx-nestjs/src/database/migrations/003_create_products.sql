-- Products and Batches
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    brand_name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    strength VARCHAR(100),
    dosage_form VARCHAR(100),
    manufacturer_id UUID,
    pack_structure VARCHAR(200),
    sale_unit VARCHAR(50),
    purchase_unit VARCHAR(50),
    is_medicine BOOLEAN NOT NULL DEFAULT true,
    is_controlled BOOLEAN DEFAULT false,
    is_cold_chain BOOLEAN DEFAULT false,
    category_id UUID,
    min_stock NUMERIC(14, 3),
    max_stock NUMERIC(14, 3),
    reorder_point NUMERIC(14, 3),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(product_id),
    batch_no VARCHAR(100) NOT NULL,
    expiry_date DATE,
    is_quarantined BOOLEAN DEFAULT false,
    is_expired BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, batch_no)
);

CREATE INDEX IF NOT EXISTS idx_product_batches_product ON product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_product_batches_expiry ON product_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);
