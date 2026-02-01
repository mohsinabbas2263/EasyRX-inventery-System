import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequirePermissions, PermissionCode } from '../security/decorators/permissions.decorator';
import { AuditAction } from '../security/decorators/audit.decorator';
import { UserQueryDto } from './dto/user-query.dto';

@Controller('api/v1/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @RequirePermissions(PermissionCode.USER_MANAGE)
    findAll(@Query() query: UserQueryDto) {
        return this.usersService.findAll(query.branchId);
    }

    @Patch(':id/role')
    @RequirePermissions(PermissionCode.USER_CHANGE_ROLE)
    @AuditAction('USER:CHANGE_ROLE')
    updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.usersService.updateRole(id, role);
    }
}
