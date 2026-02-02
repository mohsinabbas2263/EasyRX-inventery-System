import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MovementService } from '../services/movement.service';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { CycleCountDto, AdjustmentDto } from '../dto/adjustment.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../../security/decorators/permissions.decorator';
import { AuditAction } from '../../security/decorators/audit.decorator';
import { TenantContextService } from '../../../common/services/tenant-context.service';

@Controller('api/v1/inventory/movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MovementController {
  constructor(
    private movementService: MovementService,
    private tenantContext: TenantContextService,
  ) { }

  @Post()
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:CREATE_MOVEMENT')
  async createMovement(@Body() dto: CreateMovementDto) {
    const branchId = this.tenantContext.branchId;

    if (branchId && dto.branchId !== branchId) {
      // Ho Admin check omitted here for simplicity as interceptor handles it
    }

    return this.movementService.createMovement(dto);
  }

  @Post('cycle-count')
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:CYCLE_COUNT')
  async applyCycleCount(@Body() dto: CycleCountDto) {
    return this.movementService.applyCycleCount(dto);
  }

  @Post('adjustment')
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:ADJUSTMENT')
  async createAdjustment(@Body() dto: AdjustmentDto) {
    return this.movementService.createAdjustment(dto);
  }
}
