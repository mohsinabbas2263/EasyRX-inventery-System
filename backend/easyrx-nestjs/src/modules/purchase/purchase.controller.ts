import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreateSupplierDto } from './dto/supplier.dto';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('purchase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // --- Suppliers ---
  @Post('suppliers')
  @RequirePermissions(PermissionCode.SUPPLIER_MANAGE)
  @ApiOperation({ summary: 'Register a new supplier' })
  createSupplier(
    @Body() dto: CreateSupplierDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.purchaseService.createSupplier(dto, req.user.userId);
  }

  @Get('suppliers')
  @RequirePermissions(PermissionCode.SUPPLIER_MANAGE)
  @ApiOperation({ summary: 'Get all suppliers' })
  findAllSuppliers(@NestRequest() req: RequestWithUser) {
    return this.purchaseService.findAllSuppliers(req.user.companyId);
  }

  // --- Purchase Orders ---
  @Post('orders')
  @RequirePermissions(PermissionCode.PURCHASE_ORDER_MANAGE)
  @ApiOperation({ summary: 'Create a new purchase order' })
  createPurchaseOrder(
    @Body() dto: CreatePurchaseOrderDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.purchaseService.createPurchaseOrder(dto, req.user.userId);
  }

  @Get('orders')
  @RequirePermissions(PermissionCode.PURCHASE_ORDER_MANAGE)
  @ApiOperation({ summary: 'Get all purchase orders for the branch' })
  findAllPurchaseOrders(@NestRequest() req: RequestWithUser) {
    return this.purchaseService.findAllPurchaseOrders(req.user.branchId || '');
  }
}
