-- Current Stock View
CREATE OR REPLACE VIEW vw_current_stock AS
SELECT
    il.branch_id,
    il.product_id,
    p.brand_name as product_name,
    p.category_id,
    il.batch_id,
    pb.batch_no,
    pb.expiry_date,
    il.bin_id,
    bl.code as bin_code,
    COALESCE(SUM(il.qty_in - il.qty_out), 0) as qty_on_hand,
    MAX(il.unit_cost) as last_unit_cost,
    MAX(il.posted_at) as last_movement_date
FROM inventory_ledger il
LEFT JOIN products p ON il.product_id = p.product_id
LEFT JOIN product_batches pb ON il.batch_id = pb.batch_id
LEFT JOIN bin_locations bl ON il.bin_id = bl.id
GROUP BY
    il.branch_id,
    il.product_id,
    p.brand_name,
    p.category_id,
    il.batch_id,
    pb.batch_no,
    pb.expiry_date,
    il.bin_id,
    bl.code;

-- Near-expiry batches view
CREATE OR REPLACE VIEW vw_near_expiry AS
SELECT
    p.product_id,
    p.brand_name,
    pb.batch_id,
    pb.batch_no,
    pb.expiry_date,
    (pb.expiry_date - CURRENT_DATE) as days_to_expiry,
    COALESCE(SUM(il.qty_in - il.qty_out), 0) as qty_on_hand
FROM inventory_ledger il
LEFT JOIN products p ON il.product_id = p.product_id
LEFT JOIN product_batches pb ON il.batch_id = pb.batch_id
WHERE pb.expiry_date IS NOT NULL
    AND pb.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
    AND pb.expiry_date > CURRENT_DATE
GROUP BY p.product_id, p.brand_name, pb.batch_id, pb.batch_no, pb.expiry_date
HAVING COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0;

-- Dead stock view
CREATE OR REPLACE VIEW vw_dead_stock AS
SELECT
    p.product_id,
    p.brand_name,
    p.category_id,
    COALESCE(SUM(il.qty_in - il.qty_out), 0) as qty_on_hand,
    MAX(il.posted_at) as last_movement_date,
    (CURRENT_DATE - CAST(MAX(il.posted_at) AS DATE)) as days_since_movement
FROM inventory_ledger il
LEFT JOIN products p ON il.product_id = p.product_id
WHERE NOT EXISTS (
    SELECT 1 FROM inventory_ledger il2
    WHERE il2.product_id = il.product_id
        AND il2.branch_id = il.branch_id
        AND il2.movement_type IN ('SALE', 'TRANSFER_OUT', 'RETURN_OUT')
        AND il2.posted_at > CURRENT_DATE - INTERVAL '180 days'
)
GROUP BY p.product_id, p.brand_name, p.category_id
HAVING COALESCE(SUM(il.qty_in - il.qty_out), 0) >= 1;
