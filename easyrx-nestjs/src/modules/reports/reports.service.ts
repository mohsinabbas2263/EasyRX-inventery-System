import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from 'fast-csv';
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

@Injectable()
export class ReportsService {
    constructor(
        private dataSource: DataSource,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async getSalesReport(query: SalesReportQueryDto): Promise<SalesReportResponseDto> {
        const cacheKey = `sales-report:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get<SalesReportResponseDto>(cacheKey);
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

        const formattedBuckets: SalesBucketDto[] = buckets.map((bucket: any) => {
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

        await this.cacheManager.set(cacheKey, result);
        return result;
    }

    async getExpiryRisk(query: ExpiryReportQueryDto): Promise<ExpiryRiskDto[]> {
        const cacheKey = `expiry-risk:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get<ExpiryRiskDto[]>(cacheKey);
        if (cached) return cached;

        const queryPath = path.join(__dirname, 'queries', 'expiry-risk.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            query.branchId || null,
            query.daysThreshold,
            query.limit,
            query.offset,
        ]);

        const formatted: ExpiryRiskDto[] = results.map((row: any) => ({
            productId: row.product_id,
            productName: row.product_name,
            batchNo: row.batch_no,
            expiryDate: new Date(row.expiry_date).toISOString().split('T')[0],
            qtyOnHand: parseFloat(row.qty_on_hand),
            daysToExpiry: parseInt(row.days_to_expiry),
            riskLevel: row.risk_level,
        }));

        await this.cacheManager.set(cacheKey, formatted);
        return formatted;
    }

    async getStockAging(query: AgingReportQueryDto): Promise<StockAgingDto[]> {
        const cacheKey = `stock-aging:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get<StockAgingDto[]>(cacheKey);
        if (cached) return cached;

        const queryPath = path.join(__dirname, 'queries', 'stock-aging.sql');
        const sqlQuery = fs.readFileSync(queryPath, 'utf-8');

        const results = await this.dataSource.query(sqlQuery, [
            query.branchId || null,
            query.minDaysStagnant,
        ]);

        const formatted: StockAgingDto[] = results.map((row: any) => ({
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

        await this.cacheManager.set(cacheKey, formatted);
        return formatted;
    }

    async getSupplierPerformance(
        query: SupplierReportQueryDto,
    ): Promise<SupplierPerformanceDto[]> {
        const cacheKey = `supplier-perf:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get<SupplierPerformanceDto[]>(cacheKey);
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

        const formatted: SupplierPerformanceDto[] = results.map((row: any) => ({
            supplierId: row.supplier_id,
            supplierName: row.supplier_name,
            totalSpend: parseFloat(row.total_spend),
            grnCount: parseInt(row.grn_count),
            avgDeliveryDays: parseFloat(row.avg_delivery_days),
            onTimePercent: parseFloat(row.on_time_percent),
            fillRate: parseFloat(row.fill_rate),
            qualityIssues: parseInt(row.quality_issues),
        }));

        await this.cacheManager.set(cacheKey, formatted);
        return formatted;
    }

    async getStaffProductivity(
        query: StaffProductivityQueryDto,
    ): Promise<StaffProductivityDto[]> {
        const cacheKey = `staff-prod:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get<StaffProductivityDto[]>(cacheKey);
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

        const formatted: StaffProductivityDto[] = results.map((row: any) => ({
            userId: row.user_id,
            staffName: row.staff_name,
            invoiceCount: parseInt(row.invoice_count),
            totalSalesValue: parseFloat(row.total_sales_value),
            avgSaleValue: parseFloat(row.avg_sale_value),
            itemsSold: parseInt(row.items_sold),
            avgItemsPerInvoice: parseFloat(row.avg_items_per_invoice),
            avgSaleTime: parseInt(row.avg_sale_time_seconds),
        }));

        await this.cacheManager.set(cacheKey, formatted);
        return formatted;
    }

    async exportCsv(
        reportType: string,
        query: any,
    ): Promise<{ filename: string; csv: string }> {
        let data: any[] = [];
        const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');

        switch (reportType) {
            case 'sales':
                const salesReport = await this.getSalesReport(query);
                data = salesReport.buckets;
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
                data = await this.getStaffProductivity(query);
                break;
            default:
                throw new BadRequestException(`Unknown report type: ${reportType}`);
        }

        return new Promise((resolve, reject) => {
            const output: string[] = [];
            const csvStream = Parser.createObjectStringifier();

            csvStream.on('data', (chunk) => {
                output.push(chunk);
            });

            csvStream.on('end', () => {
                const filename = `eazyrx-${reportType}-${timestamp}.csv`;
                resolve({
                    filename,
                    csv: output.join('\n'),
                });
            });

            csvStream.on('error', reject);

            data.forEach((row) => csvStream.write(row));
            csvStream.end();
        });
    }
}
