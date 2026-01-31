import {
    Controller,
    Get,
    Query,
    UseGuards,
    Res,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../security/decorators/permissions.decorator';
import { AuditAction } from '../security/interceptors/audit.interceptor';
import {
    SalesReportQueryDto,
    ExportFormat,
    SalesReportResponseDto,
} from './dto/sales-report.dto';
import { ExpiryReportQueryDto, AgingReportQueryDto } from './dto/inventory-report.dto';
import { SupplierReportQueryDto, StaffProductivityQueryDto } from './dto/supplier-report.dto';

@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get('sales')
    @RequirePermissions(PermissionCode.REPORT_FINANCIAL)
    @AuditAction('REPORT:SALES')
    async getSalesReport(
        @Query() query: SalesReportQueryDto,
        @Request() req,
    ): Promise<SalesReportResponseDto> {
        // Enforce branch isolation: non-HO_ADMIN users see only their branch
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }
        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }
        return this.reportsService.getSalesReport(query);
    }

    @Get('inventory/expiry')
    @RequirePermissions(PermissionCode.REPORT_INVENTORY)
    @AuditAction('REPORT:EXPIRY')
    async getExpiryReport(
        @Query() query: ExpiryReportQueryDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }
        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }
        return this.reportsService.getExpiryRisk(query);
    }

    @Get('inventory/aging')
    @RequirePermissions(PermissionCode.REPORT_INVENTORY)
    @AuditAction('REPORT:AGING')
    async getAgingReport(
        @Query() query: AgingReportQueryDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }
        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }
        return this.reportsService.getStockAging(query);
    }

    @Get('purchase/supplier')
    @RequirePermissions(PermissionCode.REPORT_FINANCIAL)
    @AuditAction('REPORT:SUPPLIER')
    async getSupplierReport(
        @Query() query: SupplierReportQueryDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }
        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }
        return this.reportsService.getSupplierPerformance(query);
    }

    @Get('staff/productivity')
    @RequirePermissions(PermissionCode.REPORT_FINANCIAL)
    @AuditAction('REPORT:PRODUCTIVITY')
    async getProductivityReport(
        @Query() query: StaffProductivityQueryDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }
        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }
        return this.reportsService.getStaffProductivity(query);
    }

    @Get('export')
    @RequirePermissions(PermissionCode.AUDIT_EXPORT)
    @AuditAction('REPORT:EXPORT')
    async exportReport(
        @Query('type') type: string,
        @Query('format') format: ExportFormat = ExportFormat.CSV,
        @Query() queryParams: any,
        @Request() req,
        @Res({ passthrough: false }) res: Response,
    ) {
        if (!['sales', 'expiry', 'aging', 'supplier', 'productivity'].includes(type)) {
            throw new BadRequestException('Invalid report type');
        }

        if (format !== ExportFormat.CSV) {
            throw new BadRequestException('Only CSV export is supported');
        }

        const { filename, csv } = await this.reportsService.exportCsv(type, queryParams);

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
}