import { Controller, Get, Query, UseGuards, Res, Request as NestRequest } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../decorators/permissions.decorator';
import { AuditAction } from '../decorators/audit.decorator';
import { AuditService } from '../services/audit.service';
import { Response } from 'express';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';

@Controller('api/v1/audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
    constructor(private auditService: AuditService) { }

    @Get()
    @RequirePermissions(PermissionCode.AUDIT_VIEW)
    @AuditAction('AUDIT:LIST')
    async getAuditLogs(
        @NestRequest() req: RequestWithUser,
        @Query('from') from?: string,
        @Query('to') to?: string,
        @Query('userId') userId?: string,
        @Query('action') action?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.auditService.getAuditLogs({
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
            userId,
            action,
            companyId: req.user.companyId,
            limit: limit ? parseInt(limit) : 50,
            offset: offset ? parseInt(offset) : 0,
        });
    }

    @Get('export')
    @RequirePermissions(PermissionCode.AUDIT_EXPORT)
    @AuditAction('AUDIT:EXPORT')
    async exportAuditCsv(
        @NestRequest() req: RequestWithUser,
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('userId') userId: string,
        @Query('action') action: string,
        @Res({ passthrough: false }) res: Response,
    ) {
        const csv = await this.auditService.exportAuditCsv({
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
            userId,
            action,
            companyId: req.user.companyId,
        });

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="audit-export.csv"');
        res.send(csv);
    }
}
