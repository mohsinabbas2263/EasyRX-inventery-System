import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../services/tenant-context.service';
import { RequestWithUser } from '../interfaces/request-with-user.interface';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    constructor(private readonly tenantContextService: TenantContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;

        if (user) {
            return new Observable((observer) => {
                this.tenantContextService.run(
                    {
                        companyId: user.companyId,
                        branchId: user.branchId,
                        userId: user.userId,
                    },
                    () => {
                        next.handle().subscribe(observer);
                    },
                );
            });
        }

        return next.handle();
    }
}
