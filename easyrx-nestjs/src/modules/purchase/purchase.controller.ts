import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreateSupplierDto } from './dto/supplier.dto';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { Permissions } from '../security/decorators/permissions.decorator';

@ApiTags('purchase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    // --- Suppliers ---
    @Post('suppliers')
    @Permissions('SUPPLIERS_CREATE')
    @ApiOperation({ summary: 'Register a new supplier' })
    createSupplier(@Body() dto: CreateSupplierDto, @Request() req: any) {
        return this.purchaseService.createSupplier(dto, req.user.userId);
    }

    @Get('suppliers')
    @Permissions('SUPPLIERS_VIEW')
    @ApiOperation({ summary: 'Get all suppliers' })
    findAllSuppliers(@Request() req: any) {
        return this.purchaseService.findAllSuppliers(req.user.companyId);
    }

    // --- Purchase Orders ---
    @Post('orders')
    @Permissions('PURCHASE_ORDERS_CREATE')
    @ApiOperation({ summary: 'Create a new purchase order' })
    createPurchaseOrder(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
        return this.purchaseService.createPurchaseOrder(dto, req.user.userId);
    }

    @Get('orders')
    @Permissions('PURCHASE_ORDERS_VIEW')
    @ApiOperation({ summary: 'Get all purchase orders for the branch' })
    findAllPurchaseOrders(@Request() req: any) {
        // Note: branchId should ideally come from user context or query
        return this.purchaseService.findAllPurchaseOrders(req.headers['x-branch-id']);
    }
}
