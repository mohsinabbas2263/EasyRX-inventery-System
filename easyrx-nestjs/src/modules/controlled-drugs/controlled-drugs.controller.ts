import { Controller, Post, Body, Request } from '@nestjs/common';
import { ControlledDrugsService } from './controlled-drugs.service';
import { RequirePermissions, PermissionCode } from '../security/decorators/permissions.decorator';
import { AuditAction } from '../security/interceptors/audit.interceptor';
import { CreateControlledDispenseDto } from './dto/create-controlled-dispense.dto';

@Controller('api/v1/controlled-drugs')
export class ControlledDrugsController {
    constructor(private readonly service: ControlledDrugsService) { }

    @Post('dispense')
    @RequirePermissions(PermissionCode.POS_DISPENSE_CONTROLLED)
    @AuditAction('CONTROLLED:DISPENSE')
    dispense(@Body() dto: CreateControlledDispenseDto, @Request() req) {
        return this.service.logDispense(dto, req.user);
    }
}
