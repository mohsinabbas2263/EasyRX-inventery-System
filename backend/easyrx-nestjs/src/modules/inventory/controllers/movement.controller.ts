import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as NestRequest,
  BadRequestException,
} from '@nestjs/common';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
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

@Controller('api/v1/inventory/movements')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MovementController {
  constructor(private movementService: MovementService) {}

  @Post()
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:CREATE_MOVEMENT')
  async createMovement(
    @Body() dto: CreateMovementDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
      throw new BadRequestException(
        'Unauthorized: Cannot post movements for other branches',
      );
    }

    if (req.user.role !== 'HO_ADMIN') {
      dto.branchId = req.user.branchId || '';
    }

    return this.movementService.createMovement(dto, req.user.userId);
  }

  @Post('cycle-count')
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:CYCLE_COUNT')
  async applyCycleCount(
    @Body() dto: CycleCountDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
      throw new BadRequestException('Unauthorized');
    }

    if (req.user.role !== 'HO_ADMIN') {
      dto.branchId = req.user.branchId || '';
    }

    return this.movementService.applyCycleCount(dto, req.user.userId);
  }

  @Post('adjustment')
  @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
  @AuditAction('INVENTORY:ADJUSTMENT')
  async createAdjustment(
    @Body() dto: AdjustmentDto,
    @NestRequest() req: RequestWithUser,
  ) {
    if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
      throw new BadRequestException('Unauthorized');
    }

    if (req.user.role !== 'HO_ADMIN') {
      dto.branchId = req.user.branchId || '';
    }

    return this.movementService.createAdjustment(dto, req.user.userId);
  }
}
