import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request as NestRequest,
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
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('api/v1/inventory/stock')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:STOCK_QUERY')
  @ApiOperation({ summary: 'Get current stock' })
  async getStock(
    @Query() query: StockQueryDto,
    @NestRequest() req: RequestWithUser,
  ) {
    // Enforce branch scoping
    if (
      req.user.role !== 'HO_ADMIN' &&
      query.branchId &&
      query.branchId !== req.user.branchId
    ) {
      throw new BadRequestException('Unauthorized: Cannot view other branches');
    }

    if (req.user.role !== 'HO_ADMIN') {
      query.branchId = req.user.branchId || '';
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
    @NestRequest() req: RequestWithUser,
    @Query('branchId') branchId?: string,
    @Query('days') days: number = 90,
  ) {
    const finalBranchId = branchId || req.user.branchId || '';

    if (req.user.role !== 'HO_ADMIN' && finalBranchId !== req.user.branchId) {
      throw new BadRequestException('Unauthorized: Cannot view other branches');
    }

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
    @NestRequest() req: RequestWithUser,
    @Query('branchId') branchId?: string,
    @Query('minDays') minDays: number = 180,
    @Query('minQty') minQty: number = 1,
  ) {
    const finalBranchId = branchId || req.user.branchId || '';

    if (req.user.role !== 'HO_ADMIN' && finalBranchId !== req.user.branchId) {
      throw new BadRequestException('Unauthorized: Cannot view other branches');
    }

    if (!finalBranchId) {
      throw new BadRequestException('Branch ID is required');
    }

    return this.stockService.getDeadStock(finalBranchId, minDays, minQty);
  }
}
