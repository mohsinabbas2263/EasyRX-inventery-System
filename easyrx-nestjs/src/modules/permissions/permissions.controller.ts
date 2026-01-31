import { Controller, Post, Body, Request } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { RequirePermissions, PermissionCode } from '../../common/decorators/permissions.decorator';
import { AuditAction } from '../../common/decorators/audit-action.decorator';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Controller('api/v1/permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Post('assign')
    @RequirePermissions(PermissionCode.USER_MANAGE)
    @AuditAction('PERMISSIONS:ASSIGN')
    assignBulk(@Body() dto: AssignPermissionsDto, @Request() req) {
        return this.permissionsService.assignBulk(dto.userId, dto.permissionCodes, req.user?.userId);
    }
}
