import {
  Controller,
  Post,
  Body,
  Request as NestRequest,
  UseGuards,
} from '@nestjs/common';
import { ControlledDrugsService } from './controlled-drugs.service';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';
import { AuditAction } from '../security/decorators/audit.decorator';
import { CreateControlledDispenseDto } from './dto/create-controlled-dispense.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('controlled-drugs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/controlled-drugs')
export class ControlledDrugsController {
  constructor(private readonly service: ControlledDrugsService) {}

  @Post('dispense')
  @RequirePermissions(PermissionCode.POS_DISPENSE_CONTROLLED)
  @AuditAction('CONTROLLED:DISPENSE')
  dispense(
    @Body() dto: CreateControlledDispenseDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.service.logDispense(dto, {
      userId: req.user.userId,
      companyId: req.user.companyId,
      branchId: req.user.branchId || '',
    });
  }
}
