-- Stock aging and slow-moving analysis
WITH current_stock AS (
    SELECT 
        il.product_id,
        SUM(CASE WHEN il.movement_type IN ('GRN', 'RETURN') THEN il.qty_in - il.qty_out ELSE -il.qty_out END) as qty_on_hand,
        MAX(il.unit_cost) as unit_cost,
        MAX(il.posted_at) as last_movement_date
    FROM inventory_ledger il
    WHERE (:branchId::uuid IS NULL OR il.branch_id = :branchId::uuid)
    GROUP BY il.product_id
    HAVING SUM(CASE WHEN il.movement_type IN ('GRN', 'RETURN') THEN il.qty_in - il.qty_out ELSE -il.qty_out END) > 0
),
movement_stats AS (
    SELECT 
        product_id,
        SUM(CASE WHEN movement_type = 'SALE' THEN qty_out ELSE 0 END) as qty_sold_6m,
        SUM(CASE WHEN movement_type = 'SALE' THEN qty_out ELSE 0 END) / 
            NULLIF(
                EXTRACT(DAY FROM CURRENT_DATE - MIN(CASE WHEN movement_type = 'SALE' THEN posted_at END)),
                0
            ) as daily_velocity
    FROM inventory_ledger
    WHERE posted_at >= CURRENT_DATE - INTERVAL '180 days'
    AND (:branchId::uuid IS NULL OR branch_id = :branchId::uuid)
    GROUP BY product_id
)
SELECT
    cs.product_id,
    p.brand_name as product_name,
    p.category,
    cs.qty_on_hand,
    cs.unit_cost,
    ROUND((cs.qty_on_hand * cs.unit_cost)::numeric, 2) as total_value,
    cs.last_movement_date,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - cs.last_movement_date)::int as days_since_movement,
    CASE
        WHEN ms.daily_velocity > 10 THEN 'FAST'
        WHEN ms.daily_velocity > 1 THEN 'SLOW'
        ELSE 'DEAD'
    END as movement_type
FROM current_stock cs
JOIN products p ON cs.product_id = p.id
LEFT JOIN movement_stats ms ON cs.product_id = ms.product_id
WHERE (cs.last_movement_date <= CURRENT_DATE - INTERVAL :minDaysStagnant DAYS 
    OR ms.daily_velocity < 0.1)
ORDER BY cs.last_movement_date ASC
LIMIT :limit OFFSET :offset;
