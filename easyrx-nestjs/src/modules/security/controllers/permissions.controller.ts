import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../decorators/permissions.decorator';
import { AuditAction } from '../interceptors/audit.interceptor';
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
        @Request() req,
    ) {
        const result = await this.permissionsService.assignBulk(
            dto.userId,
            dto.permissionCodes,
            req.user.userId,
        );

        await this.auditService.createAuditLog({
            userId: req.user.userId,
            branchId: req.user.branchId,
            companyId: req.user.companyId,
            action: 'PERMISSION:ASSIGN',
            entityType: 'user_permission',
            entityId: dto.userId,
            beforeData: null,
            afterData: { permissionCodes: dto.permissionCodes },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        return result;
    }
}
