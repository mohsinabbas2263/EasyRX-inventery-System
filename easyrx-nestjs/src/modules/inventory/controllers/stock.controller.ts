import { Controller, Get, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { StockQueryDto } from '../dto/stock-query.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../../security/decorators/permissions.decorator';
import { AuditAction } from '../../security/interceptors/audit.interceptor';

@Controller('api/v1/inventory/stock')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockController {
    constructor(private stockService: StockService) {}

    @Get()
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:STOCK_QUERY')
    async getStock(
        @Query() query: StockQueryDto,
        @Request() req,
    ) {
        // Enforce branch scoping
        if (req.user.role !== 'HO_ADMIN' && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }

        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }

        return this.stockService.getCurrentStock(query);
    }

    @Get('near-expiry')
    @RequirePermissions(PermissionCode.REPORT_INVENTORY)
    @AuditAction('INVENTORY:NEAR_EXPIRY')
    async getNearExpiry(
        @Query('branchId') branchId: string,
        @Query('days') days: number = 90,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }

        const finalBranchId = req.user.role === 'HO_ADMIN' ? branchId : req.user.branchId;
        return this.stockService.getNearExpiry(finalBranchId, days);
    }

    @Get('dead-stock')
    @RequirePermissions(PermissionCode.REPORT_INVENTORY)
    @AuditAction('INVENTORY:DEAD_STOCK')
    async getDeadStock(
        @Query('branchId') branchId: string,
        @Query('minDays') minDays: number = 180,
        @Query('minQty') minQty: number = 1,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot view other branches');
        }

        const finalBranchId = req.user.role === 'HO_ADMIN' ? branchId : req.user.branchId;
        return this.stockService.getDeadStock(finalBranchId, minDays, minQty);
    }
}
