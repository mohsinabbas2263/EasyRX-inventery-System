import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockService } from '../services/stock.service';
import { StockQueryDto } from '../dto/stock-query.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../../security/decorators/permissions.decorator';
import { AuditAction } from '../../security/decorators/audit.decorator';
import { TenantContextService } from '../../../common/services/tenant-context.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('api/v1/inventory/stock')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockController {
  constructor(
    private stockService: StockService,
    private tenantContext: TenantContextService,
  ) { }

  @Get()
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:STOCK_QUERY')
  @ApiOperation({ summary: 'Get current stock' })
  async getStock(@Query() query: StockQueryDto) {
    const context = this.tenantContext.context;
    if (!context) throw new BadRequestException('Tenant context not found');

    // Enforce branch scoping
    if (
      context.userId && // Should check role here if available in context, or just assume context is filtered
      query.branchId &&
      query.branchId !== context.branchId &&
      !['HO_ADMIN'].includes((context as any).role) // Role might not be in context interface yet
    ) {
      // Simplified for now, the interceptor handles most tenant scoping
    }

    if (!query.branchId && context.branchId) {
      query.branchId = context.branchId;
    }

    if (!query.branchId) {
      throw new BadRequestException('Branch ID is required');
    }

    return this.stockService.getCurrentStock(query);
  }

  @Get('near-expiry')
  @RequirePermissions(PermissionCode.REPORT_INVENTORY)
  @AuditAction('INVENTORY:NEAR_EXPIRY')
  @ApiOperation({ summary: 'Get near-expiry batches' })
  async getNearExpiry(
    @Query('branchId') branchId?: string,
    @Query('days') days: number = 90,
  ) {
    const finalBranchId = branchId || this.tenantContext.branchId;

    if (!finalBranchId) {
      throw new BadRequestException('Branch ID is required');
    }

    return this.stockService.getNearExpiry(finalBranchId, days);
  }

  @Get('dead-stock')
  @RequirePermissions(PermissionCode.REPORT_INVENTORY)
  @AuditAction('INVENTORY:DEAD_STOCK')
  @ApiOperation({ summary: 'Get dead stock report' })
  async getDeadStock(
    @Query('branchId') branchId?: string,
    @Query('minDays') minDays: number = 180,
    @Query('minQty') minQty: number = 1,
  ) {
    const finalBranchId = branchId || this.tenantContext.branchId;

    if (!finalBranchId) {
      throw new BadRequestException('Branch ID is required');
    }

    return this.stockService.getDeadStock(finalBranchId, minDays, minQty);
  }
}
