import { Controller, Get, Query, Res, Header } from '@nestjs/common';
import { AuditService } from './audit.service';
import { RequirePermissions, PermissionCode } from '../../common/decorators/permissions.decorator';

@Controller('api/v1/audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @RequirePermissions(PermissionCode.AUDIT_VIEW)
    findAll(@Query() query: any) {
        return this.auditService.findAll(query);
    }

    @Get('export')
    @RequirePermissions(PermissionCode.AUDIT_EXPORT)
    @Header('Content-Type', 'text/csv')
    async exportCsv(@Query() query: any, @Res() res: any) {
        const csv = await this.auditService.exportToCsv(query);
        res.send(csv);
    }
}
