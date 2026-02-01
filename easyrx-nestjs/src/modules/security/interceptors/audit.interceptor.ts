import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditInterceptor.name);

    constructor(private readonly auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, body, user } = request;

        // Only audit state-changing operations
        if (method === 'GET') {
            return next.handle();
        }

        const auditAction = this.mapMethodToAction(method);
        const entityType = this.extractEntityType(context);

        return next.handle().pipe(
            tap({
                next: async (data) => {
                    try {
                        await this.auditService.createAuditLog({
                            companyId: user?.companyId || null,
                            userId: user?.userId || null,
                            branchId: user?.branchId || null,
                            action: auditAction,
                            entityType: entityType || 'UNKNOWN',
                            entityId: this.extractEntityId(data) || undefined,
                            beforeData: undefined, // Would need before-fetch logic
                            afterData: method !== 'DELETE' ? this.sanitizeBody(body) : undefined,
                            ipAddress: this.getClientIp(request),
                            userAgent: request.get('user-agent') || 'unknown',
                        });
                    } catch (error) {
                        this.logger.error('Audit logging failed', (error as Error).stack);
                        // Don't throw - audit failure shouldn't break business logic
                    }
                },
            }),
        );
    }

    private mapMethodToAction(method: string): string {
        const actionMap: Record<string, string> = {
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
        };
        return actionMap[method] || 'UNKNOWN';
    }

    private extractEntityType(context: ExecutionContext): string | null {
        const controllerClass = context.getClass().name;
        return controllerClass.replace('Controller', '').toUpperCase();
    }

    private extractEntityId(data: any): string | null {
        if (!data) return null;

        // Try common ID field names
        const idFields = ['id', 'userId', 'productId', 'saleId', 'invoiceId'];
        for (const field of idFields) {
            if (data[field]) return String(data[field]);
        }

        return null;
    }

    private getClientIp(request: any): string {
        return (
            request.headers['x-forwarded-for']?.split(',')[0].trim() ||
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
