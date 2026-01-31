import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../modules/audit/audit.service';
import { AUDIT_ACTION_KEY } from '../decorators/audit-action.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private auditService: AuditService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditAction = this.reflector.get<string>(AUDIT_ACTION_KEY, context.getHandler());

        if (!auditAction) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const { ip, method, url, body } = request;
        const userAgent = request.get('user-agent') || '';

        // Capture before data if needed (complex implementation required for updates)
        // For now, we capture request body as 'after' data implication

        return next.handle().pipe(
            tap(async (data) => {
                try {
                    await this.auditService.log({
                        companyId: user?.companyId || 0, // Fallback or handle system actions
                        userId: user?.userId,
                        branchId: user?.branchId,
                        action: auditAction,
                        entityType: 'API', // Can be refined
                        entityId: data?.id || 'N/A',
                        beforeData: method === 'PATCH' || method === 'PUT' ? {} : {},
                        afterData: method !== 'GET' ? body : {},
                        ipAddress: ip,
                        userAgent: userAgent,
                        requestId: request.id // If using request-id middleware
                    });
                } catch (error) {
                    console.error('Audit logging failed:', error);
                }
            }),
        );
    }
}
