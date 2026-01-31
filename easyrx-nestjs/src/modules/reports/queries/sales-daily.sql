-- Sales Report grouped by day/week/month
SELECT
    DATE_TRUNC(:groupBy::text, si.posted_at)::DATE as period_date,
    COALESCE(SUM(si.net_total), 0) as net_sales,
    COALESCE(SUM(si.gross_total), 0) as gross_sales,
    COALESCE(SUM(si.cost_of_goods_sold), 0) as cost_of_goods,
    COALESCE(SUM(si.gross_total - si.cost_of_goods_sold), 0) as margin,
    CASE 
        WHEN SUM(si.gross_total) > 0 
        THEN ROUND(((SUM(si.gross_total - si.cost_of_goods_sold) / SUM(si.gross_total)) * 100)::numeric, 2)
        ELSE 0 
    END as margin_percent,
    COALESCE(SUM(sil.qty), 0)::bigint as items_sold,
    COUNT(DISTINCT si.id)::bigint as invoice_count
FROM sales_invoices si
LEFT JOIN sales_invoice_lines sil ON si.id = sil.sale_id
WHERE 
    si.posted_at >= :fromDate
    AND si.posted_at < :toDate
    AND si.status = 'POSTED'
    AND (:branchId::uuid IS NULL OR si.branch_id = :branchId::uuid)
    AND (:category::text IS NULL OR EXISTS (
        SELECT 1 FROM products p 
        WHERE p.id = sil.product_id 
        AND p.category = :category
    ))
GROUP BY DATE_TRUNC(:groupBy::text, si.posted_at)
ORDER BY period_date DESC;
