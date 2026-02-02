-- Supplier performance analytics
WITH grn_metrics AS (
    SELECT 
        gh.supplier_id,
        COUNT(*) as grn_count,
        SUM(pil.qty * pil.unit_price) as total_spend,
        AVG(EXTRACT(DAY FROM gh.received_date - gh.po_date))::numeric(5,2) as avg_delivery_days,
        ROUND(
            SUM(CASE WHEN gh.received_date <= gh.expected_date THEN 1 ELSE 0 END)::numeric / 
            NULLIF(COUNT(*), 0) * 100,
            2
        ) as on_time_percent,
        ROUND(
            SUM(CASE WHEN pil.qty = gh.received_qty THEN 1 ELSE 0 END)::numeric /
            NULLIF(COUNT(*), 0) * 100,
            2
        ) as fill_rate
    FROM grn_headers gh
    LEFT JOIN grn_lines gl ON gh.grn_id = gl.grn_id
    WHERE 
        gh.posted_at >= :fromDate
        AND gh.posted_at < :toDate
        AND (:branchId::uuid IS NULL OR gh.branch_id = :branchId::uuid)
    GROUP BY gh.supplier_id
)
SELECT
    gm.supplier_id,
    s.name as supplier_name,
    ROUND(gm.total_spend::numeric, 2) as total_spend,
    gm.grn_count,
    ROUND(gm.avg_delivery_days::numeric, 1) as avg_delivery_days,
    COALESCE(gm.on_time_percent, 0) as on_time_percent,
    COALESCE(gm.fill_rate, 0) as fill_rate,
    0 as quality_issues -- placeholder for quality defect tracking
FROM grn_metrics gm
JOIN suppliers s ON gm.supplier_id = s.id
ORDER BY gm.total_spend DESC
LIMIT :limit OFFSET :offset;
