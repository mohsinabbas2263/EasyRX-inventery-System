import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncQueue } from './entities/sync-queue.entity';

@Injectable()
export class SyncEngineService {
    private readonly logger = new Logger(SyncEngineService.name);

    constructor(
        @InjectRepository(SyncQueue)
        private readonly syncQueueRepository: Repository<SyncQueue>,
    ) { }

    /**
     * Process pending items in the sync queue for a branch
     */
    async syncPendingQueue(branchId: string): Promise<any> {
        const pendingItems = await this.syncQueueRepository.find({
            where: { branchId, status: 'PENDING' },
            order: { priority: 'DESC', createdAt: 'ASC' },
            take: 50, // Process in batches
        });

        const results = { success: 0, failed: 0, conflicts: 0 };

        for (const item of pendingItems) {
            try {
                // 1. Check idempotency (prevent duplicate process)
                if (await this.isDuplicate()) {
                    item.status = 'SYNCED';
                    await this.syncQueueRepository.save(item);
                    results.success++;
                    continue;
                }

                // 2. Process based on document type
                await this.processSyncItem(item);

                item.status = 'SYNCED';
                results.success++;
            } catch (error: any) {
                this.logger.error(`Sync failed for item ${item.syncId}: ${error.message}`);
                item.status = 'FAILED';
                item.lastError = error.message;
                item.retryCount++;
                results.failed++;
            } finally {
                await this.syncQueueRepository.save(item);
            }
        }

        return results;
    }

    private async isDuplicate(): Promise<boolean> {
        // Check if the document already exists in the system by localUuid
        // This is specific to each document type's implementation
        // For now, we use the record of the sync queue itself if synchronized before
        return false; // Real implementation would query the destination table (e.g., SalesInvoice)
    }

    private async processSyncItem(item: SyncQueue) {
        switch (item.documentType) {
            case 'SALE':
                // Payload would contain the CreateSaleDto
                // The user object would need to be reconstructed or extracted from the payload/system
                // await this.salesService.createSale(item.payload, item.payload.user);
                break;
            // Add more cases for other document types
            default:
                throw new Error(`Unsupported document type: ${item.documentType}`);
        }
    }
}
