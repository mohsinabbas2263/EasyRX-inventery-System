import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
    companyId: string;
    branchId?: string;
    userId: string;
}

@Injectable()
export class TenantContextService {
    private static readonly storage = new AsyncLocalStorage<TenantContext>();

    run(context: TenantContext, callback: () => void) {
        return TenantContextService.storage.run(context, callback);
    }

    get companyId(): string | undefined {
        return TenantContextService.storage.getStore()?.companyId;
    }

    get branchId(): string | undefined {
        return TenantContextService.storage.getStore()?.branchId;
    }

    get userId(): string | undefined {
        return TenantContextService.storage.getStore()?.userId;
    }

    get context(): TenantContext | undefined {
        return TenantContextService.storage.getStore();
    }
}
