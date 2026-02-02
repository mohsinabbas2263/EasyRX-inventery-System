import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SyncQueue } from './entities/sync-queue.entity';
import { TenantContextService } from '../../common/services/tenant-context.service';

@Injectable()
export class SyncEngineService {
  private readonly logger = new Logger(SyncEngineService.name);

  constructor(
    @InjectRepository(SyncQueue)
    private readonly syncQueueRepository: Repository<SyncQueue>,
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContextService,
  ) { }

  /**
   * Process pending items in the sync queue for a branch
   */
  async syncPendingQueue(branchId: string): Promise<any> {
    const pendingItems = await this.syncQueueRepository.find({
      where: { branchId, status: 'PENDING' },
      order: { priority: 'DESC', createdAt: 'ASC' },
      take: 50,
    });

    const results = { success: 0, failed: 0, conflicts: 0, idempotencySkips: 0 };

    for (const item of pendingItems) {
      try {
        // 1. Clock Drift Handling: Skip items with future timestamps (if critical)
        if (item.createdAt > new Date(Date.now() + 5000)) {
          this.logger.warn(`Clock drift detected for item ${item.syncId}. Skipping.`);
          continue;
        }

        // 2. Check idempotency (prevent duplicate process)
        if (await this.isDuplicate(item)) {
          item.status = 'SYNCED';
          item.syncedAt = new Date();
          await this.syncQueueRepository.save(item);
          results.idempotencySkips++;
          continue;
        }

        // 3. Conflict Detection & Resolution
        const conflict = await this.detectConflict(item);
        if (conflict) {
          await this.resolveConflict(item, conflict);
          results.conflicts++;
          continue;
        }

        // 4. Process Logic
        await this.processSyncItem(item);

        item.status = 'SYNCED';
        item.syncedAt = new Date();
        results.success++;
      } catch (error: any) {
        this.logger.error(`Sync failed for item ${item.syncId}: ${error.message}`);

        // 5. Exponential Backoff Logic
        await this.handleRetry(item, error.message);
        results.failed++;
      } finally {
        await this.syncQueueRepository.save(item);
      }
    }

    return results;
  }

  private async isDuplicate(item: SyncQueue): Promise<boolean> {
    const table = this.getTableName(item.documentType);
    const companyId = this.tenantContext.companyId;
    if (!companyId || !table) return false;

    const exists = await this.dataSource.query(
      `SELECT 1 FROM "${table}" WHERE "local_uuid" = $1 AND "company_id" = $2`,
      [item.localUuid, companyId],
    );
    return exists.length > 0;
  }

  private async detectConflict(item: SyncQueue): Promise<any | null> {
    // Conflict detection: If central record modified after local update
    const table = this.getTableName(item.documentType);
    if (!table) return null;

    const centralRecord = await this.dataSource.query(
      `SELECT updated_at FROM "${table}" WHERE "local_uuid" = $1 LIMIT 1`,
      [item.localUuid]
    );

    if (centralRecord.length > 0) {
      // Simple logic: If central updated_at > item.payload.lastSyncTime (from client)
      const centralTime = new Date(centralRecord[0].updated_at).getTime();
      const clientRefTime = new Date(item.payload?.clientLastSyncTime || 0).getTime();

      if (centralTime > clientRefTime) {
        return centralRecord[0];
      }
    }
    return null;
  }

  private async resolveConflict(item: SyncQueue, _conflict: any) {
    // Resolution Strategy: LWW (Last Write Wins) or Server Wins
    // For pharma, usually Server Wins or Manual for sensitive items.
    // Here we mark as CONFLICT to allow manual review if needed, 
    // or implement automated resolution.
    item.status = 'CONFLICT';
    item.lastError = 'Data modified on server since last client pull (Conflict)';
  }

  private async handleRetry(item: SyncQueue, errorMessage: string) {
    item.retryCount++;
    item.lastError = errorMessage;

    if (item.retryCount >= 5) {
      item.status = 'FAILED';
    } else {
      // Calculate next retry time (Exponential Backoff: 1m, 4m, 9m, 16m...)
      const waitMinutes = Math.pow(item.retryCount, 2);
      const nextRetry = new Date();
      nextRetry.setMinutes(nextRetry.getMinutes() + waitMinutes);
      // status remains PENDING but we could have a nextRetryAt field
    }
  }

  private getTableName(docType: string): string | null {
    switch (docType) {
      case 'SALE': return 'sales_invoices';
      case 'INVENTORY_ADJUST': return 'inventory_ledger';
      case 'PURCHASE_ORDER': return 'purchase_orders';
      default: return null;
    }
  }

  private async processSyncItem(_item: SyncQueue) {
    // This would call respective services inside a transaction
    // Implementation omitted for brevity but follows service.create(item.payload) pattern
  }
}
