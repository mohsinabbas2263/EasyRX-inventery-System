import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AUDIT_ACTION_KEY } from '../decorators/audit.decorator';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';
import { RequestWithUser } from '../../../common/interfaces/request-with-user.interface';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, body, user } = request;

    const auditAction =
      this.reflector.get<string>(AUDIT_ACTION_KEY, context.getHandler()) ||
      this.mapMethodToAction(method);

    // Only audit if we have an action or it's a state-changing operation
    if (
      method === 'GET' &&
      !this.reflector.get<string>(AUDIT_ACTION_KEY, context.getHandler())
    ) {
      return next.handle();
    }
    const entityType = this.extractEntityType(context);

    return next.handle().pipe(
      tap({
        next: async (data: any) => {
          try {
            await this.auditService.createAuditLog({
              companyId: user?.companyId || '',
              userId: user?.userId || '',
              branchId: user?.branchId || '',
              action: auditAction,
              entityType: entityType || 'UNKNOWN',
              entityId: this.extractEntityId(data) || undefined,
              beforeData: undefined, // Would need before-fetch logic
              afterData:
                method !== 'DELETE' ? this.sanitizeBody(body) : undefined,
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
      if (data && typeof data === 'object' && field in data) {
        return String(data[field as keyof typeof data]);
      }
    }

    return null;
  }

  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ip = Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0];
      return ip.trim();
    }
    return request.socket.remoteAddress || 'unknown';
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = JSON.parse(JSON.stringify(body));
    const sensitiveFields = ['password', 'passwordHash', 'token', 'secret'];
    const sanitizeObject = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return;
      for (const key in obj) {
        if (
          sensitiveFields.some((field) =>
            key.toLowerCase().includes(field.toLowerCase()),
          )
        ) {
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
