import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

export const AUDIT_ACTION_KEY = 'auditAction';
export const AuditAction = (action: string) => Reflect.metadata(AUDIT_ACTION_KEY, action);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        @Inject(AuditService) private auditService: AuditService,
        private reflector: Reflector,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const user = request.user as any;

        const action = this.reflector.get<string>(AUDIT_ACTION_KEY, context.getHandler());
        if (!action) {
            return next.handle();
        }

        const startTime = Date.now();
        const body = this.sanitizeBody(request.body);

        return next.handle().pipe(
            tap(
                async (data) => {
                    await this.logAudit({
                        userId: user?.userId,
                        branchId: user?.branchId,
                        companyId: user?.companyId,
                        action,
                        entityType: this.extractEntityType(request.path),
                        entityId: this.extractEntityId(request.path),
                        beforeData: null,
                        afterData: this.sanitizeBody(data),
                        ipAddress: this.getClientIp(request),
                        userAgent: request.get('user-agent'),
                        requestId: (request as any).id || (Array.isArray(request.headers['x-request-id']) ? request.headers['x-request-id'][0] : request.headers['x-request-id']),
                    });
                },
                async (error) => {
                    await this.logAudit({
                        userId: user?.userId,
                        branchId: user?.branchId,
                        companyId: user?.companyId,
                        action: `${action}:ERROR`,
                        entityType: this.extractEntityType(request.path),
                        entityId: null,
                        beforeData: body,
                        afterData: { error: error.message },
                        ipAddress: this.getClientIp(request),
                        userAgent: request.get('user-agent'),
                        requestId: (request as any).id || (Array.isArray(request.headers['x-request-id']) ? request.headers['x-request-id'][0] : request.headers['x-request-id']),
                    });
                },
            ),
        );
    }

    private async logAudit(auditData: any) {
        try {
            await this.auditService.createAuditLog(auditData);
        } catch (error) {
            console.error('Failed to create audit log:', error);
        }
    }

    private extractEntityType(path: string): string {
        const segments = path.split('/').filter(Boolean);
        return segments.length > 2 ? segments[2] : segments[0];
    }

    private extractEntityId(path: string): string | null {
        const match = path.match(/\/([a-f0-9\-]{36})(?:\/|$)/);
        return match ? match[1] : null;
    }

    private getClientIp(request: Request): string {
        return (
            (request.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            'unknown'
        );
    }

    private sanitizeBody(body: any): any {
        if (!body) return null;
        const sanitized = JSON.parse(JSON.stringify(body));
        const sensitiveFields = ['password', 'passwordHash', 'token', 'secret'];
        const sanitizeObject = (obj: any) => {
            if (typeof obj !== 'object' || obj === null) return;
            for (const key in obj) {
                if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
                    obj[key] = '***REDACTED***';
                } else if (typeof obj[key] === 'object') {
                    sanitizeObject(obj[key]);
                }
            }
        };
        sanitizeObject(sanitized);
        return sanitized;
    }
}
