import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
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

@ApiTags('purchase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) { }

  // --- Suppliers ---
  @Post('suppliers')
  @RequirePermissions(PermissionCode.SUPPLIER_MANAGE)
  @ApiOperation({ summary: 'Register a new supplier' })
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.purchaseService.createSupplier(dto);
  }

  @Get('suppliers')
  @RequirePermissions(PermissionCode.SUPPLIER_MANAGE)
  @ApiOperation({ summary: 'Get all suppliers' })
  findAllSuppliers() {
    return this.purchaseService.findAllSuppliers();
  }

  // --- Purchase Orders ---
  @Post('orders')
  @RequirePermissions(PermissionCode.PURCHASE_ORDER_MANAGE)
  @ApiOperation({ summary: 'Create a new purchase order' })
  createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto) {
    return this.purchaseService.createPurchaseOrder(dto);
  }

  @Get('orders')
  @RequirePermissions(PermissionCode.PURCHASE_ORDER_MANAGE)
  @ApiOperation({ summary: 'Get all purchase orders for the branch' })
  findAllPurchaseOrders() {
    return this.purchaseService.findAllPurchaseOrders();
  }
}
