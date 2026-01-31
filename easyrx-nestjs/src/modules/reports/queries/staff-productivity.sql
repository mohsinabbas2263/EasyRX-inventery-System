-- Staff productivity metrics
SELECT
    si.created_by as user_id,
    u.full_name as staff_name,
    COUNT(DISTINCT si.id) as invoice_count,
    ROUND(SUM(si.net_total)::numeric, 2) as total_sales_value,
    ROUND((SUM(si.net_total) / NULLIF(COUNT(DISTINCT si.id), 0))::numeric, 2) as avg_sale_value,
    COALESCE(SUM(sil.qty), 0)::bigint as items_sold,
    ROUND(
        (COALESCE(SUM(sil.qty), 0)::numeric / NULLIF(COUNT(DISTINCT si.id), 0)),
        2
    ) as avg_items_per_invoice,
    ROUND(
        EXTRACT(EPOCH FROM (MAX(si.posted_at) - MIN(si.posted_at)))::numeric / 
        NULLIF(COUNT(DISTINCT si.id), 0),
        0
    )::int as avg_sale_time_seconds
FROM sales_invoices si
LEFT JOIN sales_invoice_lines sil ON si.id = sil.sale_id
LEFT JOIN users u ON si.created_by = u.user_id
WHERE 
    si.posted_at >= :fromDate
    AND si.posted_at < :toDate
    AND si.status = 'POSTED'
    AND (:branchId::uuid IS NULL OR si.branch_id = :branchId::uuid)
    AND (:userId::uuid IS NULL OR si.created_by = :userId::uuid)
GROUP BY si.created_by, u.full_name
ORDER BY total_sales_value DESC;
