import { Controller, Get, Patch, Param, Body, UseGuards, Query, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../decorators/permissions.decorator';
import { AuditAction, AUDIT_ACTION_KEY } from '../interceptors/audit.interceptor';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { AuditService } from '../services/audit.service';

@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private auditService: AuditService,
    ) {}

    @Get()
    @RequirePermissions(PermissionCode.USER_MANAGE)
    @AuditAction('USER:LIST')
    async getUsers(@Query('branchId') branchId: string, @Query('limit') limit = 50) {
        return this.usersRepository.find({
            where: { branchId },
            take: limit,
            select: ['userId', 'username', 'role', 'isActive', 'createdAt'],
        });
    }

    @Patch(':id/role')
    @RequirePermissions(PermissionCode.USER_CHANGE_ROLE)
    @AuditAction('USER:CHANGE_ROLE')
    async changeRole(
        @Param('id') userId: string,
        @Body() changeRoleDto: ChangeRoleDto,
        @Request() req,
    ) {
        const user = await this.usersRepository.findOne({ where: { userId } });
        if (!user) throw new Error('User not found');

        const oldRole = user.role;
        user.role = changeRoleDto.role;

        await this.auditService.createAuditLog({
            userId: req.user.userId,
            branchId: req.user.branchId,
            companyId: req.user.companyId,
            action: 'USER:CHANGE_ROLE',
            entityType: 'user',
            entityId: userId,
            beforeData: { role: oldRole },
            afterData: { role: changeRoleDto.role },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
        });

        return this.usersRepository.save(user);
    }
}
