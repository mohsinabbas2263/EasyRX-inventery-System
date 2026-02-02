-- Ensure expiry date is after manufacturing date
ALTER TABLE product_batches 
  ADD CONSTRAINT chk_expiry_after_manufacturing 
  CHECK (expiry_date >= manufacturing_date);

-- Ensure quantities are positive in ledger
ALTER TABLE inventory_ledger 
  ADD CONSTRAINT chk_qty_direction 
  CHECK (
    (qty_in > 0 AND qty_out = 0) OR
    (qty_out > 0 AND qty_in = 0) OR
    (qty_in = 0 AND qty_out = 0)
  );

-- Ensure unit cost is non-negative
ALTER TABLE inventory_ledger 
  ADD CONSTRAINT chk_unit_cost_positive 
  CHECK (unit_cost IS NULL OR unit_cost >= 0);
