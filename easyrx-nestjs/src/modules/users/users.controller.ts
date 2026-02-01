import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  Request as NestRequest,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';
import { AuditAction } from '../security/decorators/audit.decorator';
import { UserQueryDto } from './dto/user-query.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(PermissionCode.USER_MANAGE)
  findAll(@Query() query: UserQueryDto, @NestRequest() req: RequestWithUser) {
    // If not HO_ADMIN, only see users in their branch
    const branchId =
      req.user.role === 'HO_ADMIN' ? query.branchId : req.user.branchId;
    return this.usersService.findAll(branchId);
  }

  @Patch(':id/role')
  @RequirePermissions(PermissionCode.USER_CHANGE_ROLE)
  @AuditAction('USER:CHANGE_ROLE')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }
}
