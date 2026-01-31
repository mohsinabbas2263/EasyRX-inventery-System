-- Products at expiry risk
WITH current_stock AS (
    SELECT 
        product_id,
        batch_id,
        SUM(CASE WHEN movement_type IN ('GRN', 'RETURN') THEN qty_in - qty_out ELSE -qty_out END) as qty_on_hand
    FROM inventory_ledger
    WHERE (:branchId::uuid IS NULL OR branch_id = :branchId::uuid)
    GROUP BY product_id, batch_id
    HAVING SUM(CASE WHEN movement_type IN ('GRN', 'RETURN') THEN qty_in - qty_out ELSE -qty_out END) > 0
)
SELECT
    p.id as product_id,
    p.brand_name as product_name,
    pb.batch_no,
    pb.expiry_date,
    cs.qty_on_hand,
    (pb.expiry_date - CURRENT_DATE) as days_to_expiry,
    CASE
        WHEN pb.expiry_date < CURRENT_DATE THEN 'EXPIRED'
        WHEN pb.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'CRITICAL'
        WHEN pb.expiry_date <= CURRENT_DATE + INTERVAL :daysThreshold DAYS THEN 'WARNING'
        ELSE 'NORMAL'
    END as risk_level
FROM current_stock cs
JOIN products p ON cs.product_id = p.id
JOIN product_batches pb ON cs.batch_id = pb.id
WHERE pb.expiry_date <= CURRENT_DATE + INTERVAL :daysThreshold DAYS
ORDER BY days_to_expiry ASC
LIMIT :limit OFFSET :offset;
