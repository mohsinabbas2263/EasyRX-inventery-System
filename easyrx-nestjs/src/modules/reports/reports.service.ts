import { Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as path from 'path';
// import { Parser } from 'fast-csv';
import { CsvUtility } from './utils/csv.utility';
import { Writable } from 'stream';
import {
    SalesReportQueryDto,
    SalesReportResponseDto,
    SalesBucketDto,
} from './dto/sales-report.dto';
import {
    ExpiryReportQueryDto,
    ExpiryRiskDto,
    AgingReportQueryDto,
    StockAgingDto,
} from './dto/inventory-report.dto';
import {
    SupplierReportQueryDto,
    SupplierPerformanceDto,
    StaffProductivityQueryDto,
    StaffProductivityDto,
} from './dto/supplier-report.dto';

interface RawSalesBucket {
    period_date: string;
    net_sales: string;
    gross_sales: string;
    cost_of_goods: string;
    margin: string;
    margin_percent: string;
    items_sold: string;
    invoice_count: string;
}

interface RawExpiryRisk {
    product_id: string;
    product_name: string;
    batch_no: string;
    expiry_date: string;
    qty_on_hand: string;
    days_to_expiry: string;
    risk_level: string;
}

interface RawStockAging {
    product_id: string;
    product_name: string;
    category: string;
    qty_on_hand: string;
    unit_cost: string;
    total_value: string;
    last_movement_date: string;
    days_since_movement: string;
    movement_type: string;
}

interface RawSupplierPerf {
    supplier_id: string;
    supplier_name: string;
    total_spend: string;
    grn_count: string;
    avg_delivery_days: string;
    on_time_percent: string;
    fill_rate: string;
    quality_issues: string;
}

interface RawStaffProd {
    user_id: string;
    staff_name: string;
    invoice_count: string;
    total_sales_value: string;
    avg_sale_value: string;
    items_sold: string;
    avg_items_per_invoice: string;
    avg_sale_time_seconds: string;
}

@Injectable()
export class ReportsService {
    private cache = new Map<string, { data: any, expiry: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    constructor(
        private dataSource: DataSource,
    ) { }

    private async getCached<T>(key: string): Promise<T | null> {
        const cached = this.cache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        if (cached) this.cache.delete(key);
        return null;
    }

    private async setCache(key: string, data: any): Promise<void> {
        this.cache.set(key, {
            data,
            expiry: Date.now() + this.CACHE_TTL,
        });
    }

    async getSalesReport(query: SalesReportQueryDto): Promise<SalesReportResponseDto> {
        const cacheKey = `sales-report:${JSON.stringify(query)}`;
        const cached = await this.getCached<SalesReportResponseDto>(cacheKey);
        if (cached) return cached;

        const fromDate = new Date(query.from);
        const toDate = new Date(query.to);

        if (fromDate >= toDate) {
            throw new BadRequestException('From date must be before to date');
        }

        const queryPath = path.join(__dirname, 'queries', 'sales-daily.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const buckets = await this.dataSource.query(sqlQuery, [
            query.groupBy || 'day',
            fromDate.toISOString(),
            toDate.toISOString(),
            query.branchId || null,
            query.category || null,
        ]);

        let totalNetSales = 0;
        let totalGrossSales = 0;
        let totalCogs = 0;
        let totalMargin = 0;
        let totalItemsSold = 0;
        let totalInvoices = 0;

        const formattedBuckets: SalesBucketDto[] = buckets.map((bucket: RawSalesBucket) => {
            totalNetSales += parseFloat(bucket.net_sales) || 0;
            totalGrossSales += parseFloat(bucket.gross_sales) || 0;
            totalCogs += parseFloat(bucket.cost_of_goods) || 0;
            totalMargin += parseFloat(bucket.margin) || 0;
            totalItemsSold += parseInt(bucket.items_sold) || 0;
            totalInvoices += parseInt(bucket.invoice_count) || 0;

            return {
                date: new Date(bucket.period_date).toISOString().split('T')[0],
                netSales: parseFloat(bucket.net_sales) || 0,
                grossSales: parseFloat(bucket.gross_sales) || 0,
                costOfGoods: parseFloat(bucket.cost_of_goods) || 0,
                margin: parseFloat(bucket.margin) || 0,
                marginPercent: parseFloat(bucket.margin_percent) || 0,
                itemsSold: parseInt(bucket.items_sold) || 0,
                invoiceCount: parseInt(bucket.invoice_count) || 0,
            };
        });

        const result: SalesReportResponseDto = {
            buckets: formattedBuckets,
            total: {
                netSales: totalNetSales,
                grossSales: totalGrossSales,
                costOfGoods: totalCogs,
                margin: totalMargin,
                marginPercent: totalGrossSales > 0 ? (totalMargin / totalGrossSales) * 100 : 0,
                itemsSold: totalItemsSold,
                invoiceCount: totalInvoices,
            },
            period: {
                from: query.from,
                to: query.to,
                groupBy: query.groupBy,
            },
        };

        await this.setCache(cacheKey, result);
        return result;
    }

    async getExpiryRisk(query: ExpiryReportQueryDto): Promise<ExpiryRiskDto[]> {
        const cacheKey = `expiry-risk:${JSON.stringify(query)}`;
        const cached = await this.getCached<ExpiryRiskDto[]>(cacheKey);
        if (cached) return cached;

        const queryPath = path.join(__dirname, 'queries', 'expiry-risk.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            query.branchId || null,
            query.daysThreshold,
            query.limit,
            query.offset,
        ]);

        const formatted: ExpiryRiskDto[] = results.map((row: RawExpiryRisk) => ({
            productId: row.product_id,
            productName: row.product_name,
            batchNo: row.batch_no,
            expiryDate: new Date(row.expiry_date).toISOString().split('T')[0],
            qtyOnHand: parseFloat(row.qty_on_hand),
            daysToExpiry: parseInt(row.days_to_expiry),
            riskLevel: row.risk_level,
        }));

        await this.setCache(cacheKey, formatted);
        return formatted;
    }

    async getStockAging(query: AgingReportQueryDto): Promise<StockAgingDto[]> {
        const cacheKey = `stock-aging:${JSON.stringify(query)}`;
        const cached = await this.getCached<StockAgingDto[]>(cacheKey);
        if (cached) return cached;

        const queryPath = path.join(__dirname, 'queries', 'stock-aging.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            query.branchId || null,
            query.minDaysStagnant,
        ]);

        const formatted: StockAgingDto[] = results.map((row: RawStockAging) => ({
            productId: row.product_id,
            productName: row.product_name,
            category: row.category,
            qtyOnHand: parseFloat(row.qty_on_hand),
            unitCost: parseFloat(row.unit_cost),
            totalValue: parseFloat(row.total_value),
            lastMovementDate: new Date(row.last_movement_date).toISOString().split('T')[0],
            daysSinceMovement: parseInt(row.days_since_movement),
            movementType: row.movement_type,
        }));

        await this.setCache(cacheKey, formatted);
        return formatted;
    }

    async getSupplierPerformance(
        query: SupplierReportQueryDto,
    ): Promise<SupplierPerformanceDto[]> {
        const cacheKey = `supplier-perf:${JSON.stringify(query)}`;
        const cached = await this.getCached<SupplierPerformanceDto[]>(cacheKey);
        if (cached) return cached;

        const fromDate = new Date(query.from);
        const toDate = new Date(query.to);

        const queryPath = path.join(__dirname, 'queries', 'supplier-performance.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            fromDate.toISOString(),
            toDate.toISOString(),
            query.branchId || null,
            query.limit,
            query.offset,
        ]);

        const formatted: SupplierPerformanceDto[] = results.map((row: RawSupplierPerf) => ({
            supplierId: row.supplier_id,
            supplierName: row.supplier_name,
            totalSpend: parseFloat(row.total_spend),
            grnCount: parseInt(row.grn_count),
            avgDeliveryDays: parseFloat(row.avg_delivery_days),
            onTimePercent: parseFloat(row.on_time_percent),
            fillRate: parseFloat(row.fill_rate),
            qualityIssues: parseInt(row.quality_issues),
        }));

        await this.setCache(cacheKey, formatted);
        return formatted;
    }

    async getStaffProductivity(
        query: StaffProductivityQueryDto,
    ): Promise<StaffProductivityDto[]> {
        const cacheKey = `staff-prod:${JSON.stringify(query)}`;
        const cached = await this.getCached<StaffProductivityDto[]>(cacheKey);
        if (cached) return cached;

        const fromDate = new Date(query.from);
        const toDate = new Date(query.to);

        const queryPath = path.join(__dirname, 'queries', 'staff-productivity.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            fromDate.toISOString(),
            toDate.toISOString(),
            query.branchId || null,
            query.userId || null,
        ]);

        const formatted: StaffProductivityDto[] = results.map((row: RawStaffProd) => ({
            userId: row.user_id,
            staffName: row.staff_name,
            invoiceCount: parseInt(row.invoice_count),
            totalSalesValue: parseFloat(row.total_sales_value),
            avgSaleValue: parseFloat(row.avg_sale_value),
            itemsSold: parseInt(row.items_sold),
            avgItemsPerInvoice: parseFloat(row.avg_items_per_invoice),
            avgSaleTime: parseInt(row.avg_sale_time_seconds),
        }));

        await this.setCache(cacheKey, formatted);
        return formatted;
    }

    async exportCsv(
        reportType: string,
        query: any,
    ): Promise<{ filename: string; csv: string }> {
        let data: any[] = [];
        let filename = `report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;

        try {
            switch (reportType) {
                case 'sales':
                    const sales = await this.getSalesReport(query);
                    data = sales.buckets;
                    break;
                case 'expiry':
                    data = await this.getExpiryRisk(query);
                    break;
                case 'aging':
                    data = await this.getStockAging(query);
                    break;
                case 'supplier':
                    data = await this.getSupplierPerformance(query);
                    break;
                case 'productivity':
                case 'staff':
                    data = await this.getStaffProductivity(query);
                    break;
                default:
                    throw new BadRequestException('Invalid report type for export');
            }

            const csv = CsvUtility.jsonToCsv(data);
            return { filename, csv };
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new BadRequestException(`Export failed: ${error.message}`);
        }
    }
}
