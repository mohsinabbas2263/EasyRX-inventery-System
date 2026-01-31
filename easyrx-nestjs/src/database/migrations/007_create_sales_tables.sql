-- Sales Invoices
CREATE TABLE IF NOT EXISTS sales_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    counter_id UUID,
    customer_id UUID,
    prescription_id UUID,
    sale_number VARCHAR(50),
    sale_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    gross_total NUMERIC(14, 2),
    discount_total NUMERIC(14, 2),
    tax_total NUMERIC(14, 2),
    net_total NUMERIC(14, 2),
    cost_of_goods_sold NUMERIC(14, 2),
    payment_method VARCHAR(30),
    status VARCHAR(30) DEFAULT 'DRAFT',
    created_by UUID REFERENCES users(user_id),
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_invoice_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID NOT NULL REFERENCES sales_invoices(id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    batch_id UUID REFERENCES product_batches(batch_id),
    qty NUMERIC(14, 3) NOT NULL,
    unit_price NUMERIC(14, 4) NOT NULL,
    discount NUMERIC(14, 2),
    tax_amount NUMERIC(14, 2),
    line_total NUMERIC(14, 2),
    is_controlled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sales_invoices_branch_posted ON sales_invoices(branch_id, posted_at DESC) WHERE status = 'POSTED';
CREATE INDEX IF NOT EXISTS idx_sales_invoice_lines_sale ON sales_invoice_lines(sale_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_created_by ON sales_invoices(created_by);
