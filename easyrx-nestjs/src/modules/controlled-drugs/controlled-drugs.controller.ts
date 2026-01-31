import { Controller, Post, Body, Request } from '@nestjs/common';
import { ControlledDrugsService } from './controlled-drugs.service';
import { RequirePermissions, PermissionCode } from '../../common/decorators/permissions.decorator';
import { AuditAction } from '../../common/decorators/audit-action.decorator';

@Controller('api/v1/controlled-drugs')
export class ControlledDrugsController {
    constructor(private readonly service: ControlledDrugsService) { }

    @Post('dispense')
    @RequirePermissions(PermissionCode.POS_DISPENSE_CONTROLLED)
    @AuditAction('CONTROLLED:DISPENSE')
    dispense(@Body() dto: any, @Request() req) {
        return this.service.logDispense(dto, req.user?.userId);
    }
}
