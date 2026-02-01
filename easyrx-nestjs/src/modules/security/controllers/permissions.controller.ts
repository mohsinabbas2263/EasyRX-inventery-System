import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../decorators/permissions.decorator';
import { AuditAction } from '../decorators/audit.decorator';
import { PermissionsService } from '../services/permissions.service';
import { AssignPermissionsDto } from '../dto/change-role.dto';
import { AuditService } from '../services/audit.service';

@Controller('api/v1/permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    private auditService: AuditService,
  ) {}

  @Get()
  @RequirePermissions(PermissionCode.USER_MANAGE)
  @AuditAction('PERMISSION:LIST')
  async getAllPermissions() {
    const permissions = await this.permissionsService.getAllPermissions();
    return { permissions };
  }

  @Post('assign')
  @RequirePermissions(PermissionCode.USER_MANAGE)
  @AuditAction('PERMISSION:ASSIGN')
  async assignPermissions(
    @Body() dto: AssignPermissionsDto,
    @NestRequest() req: RequestWithUser,
  ) {
    const result = await this.permissionsService.assignBulk(
      dto.userId,
      dto.permissionCodes,
    );

    await this.auditService.createAuditLog({
      userId: req.user.userId,
      branchId: req.user.branchId,
      companyId: req.user.companyId,
      action: 'PERMISSION:ASSIGN',
      entityType: 'user_permission',
      entityId: dto.userId,
      beforeData: undefined,
      afterData: { permissionCodes: dto.permissionCodes },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return result;
  }
}
