import { Controller, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { MovementService } from '../services/movement.service';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { CycleCountDto, AdjustmentDto } from '../dto/adjustment.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../../security/decorators/permissions.decorator';
import { AuditAction } from '../../security/interceptors/audit.interceptor';

@Controller('api/v1/inventory/movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MovementController {
    constructor(private movementService: MovementService) {}

    @Post()
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CREATE_MOVEMENT')
    async createMovement(
        @Body() dto: CreateMovementDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized: Cannot post movements for other branches');
        }

        if (req.user.role !== 'HO_ADMIN') {
            dto.branchId = req.user.branchId;
        }

        return this.movementService.createMovement(dto, req.user.userId);
    }

    @Post('cycle-count')
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CYCLE_COUNT')
    async applyCycleCount(
        @Body() dto: CycleCountDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        if (req.user.role !== 'HO_ADMIN') {
            dto.branchId = req.user.branchId;
        }

        return this.movementService.applyCycleCount(dto, req.user.userId);
    }

    @Post('adjustment')
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:ADJUSTMENT')
    async createAdjustment(
        @Body() dto: AdjustmentDto,
        @Request() req,
    ) {
        if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        if (req.user.role !== 'HO_ADMIN') {
            dto.branchId = req.user.branchId;
        }

        return this.movementService.createAdjustment(dto, req.user.userId);
    }
}
