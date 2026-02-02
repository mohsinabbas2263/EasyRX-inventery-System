CREATE TABLE IF NOT EXISTS controlled_dispense_logs (
    dispense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(company_id),
    branch_id UUID NOT NULL REFERENCES branches(branch_id),
    prescription_ref VARCHAR(100) NOT NULL,
    product_id UUID NOT NULL REFERENCES products(product_id),
    batch_id UUID NOT NULL REFERENCES product_batches(batch_id),
    qty NUMERIC(10,2) NOT NULL,
    pharmacist_id UUID NOT NULL REFERENCES users(user_id),
    patient_name VARCHAR(200),
    patient_cnic VARCHAR(20),
    dispensed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_controlled_dispense_pharmacist ON controlled_dispense_logs(pharmacist_id);
CREATE INDEX IF NOT EXISTS idx_controlled_dispense_product ON controlled_dispense_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_controlled_dispense_date ON controlled_dispense_logs(dispensed_at DESC);
CREATE INDEX IF NOT EXISTS idx_controlled_dispense_company ON controlled_dispense_logs(company_id);
