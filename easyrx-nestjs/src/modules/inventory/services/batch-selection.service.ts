import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ProductBatch } from '../../products/entities/product-batch.entity';

export interface BatchAllocation {
    batchId: string;
    batchNo: string;
    quantity: number;
    expiryDate: Date;
    costPrice: number;
}

export class InsufficientStockException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InsufficientStockException';
    }
}

@Injectable()
export class BatchSelectionService {
    constructor(
        @InjectRepository(ProductBatch)
        private batchRepository: Repository<ProductBatch>,
    ) { }

    /**
     * Implements FEFO (First Expire First Out) batch selection
     * 
     * @param productId - The product to allocate
     * @param branchId - The branch where stock is located
     * @param quantityNeeded - Total quantity to allocate
     * @returns Array of batch allocations
     * @throws InsufficientStockException if not enough stock available
     */
    async selectBatchesForSale(
        productId: string,
        branchId: string,
        quantityNeeded: number,
    ): Promise<BatchAllocation[]> {
        // Get available batches ordered by expiry date (FEFO)
        const batches = await this.batchRepository.find({
            where: {
                productId,
                branchId,
                quantityOnHand: MoreThan(0),
                expiryDate: MoreThan(new Date()), // Skip expired batches
            },
            order: { expiryDate: 'ASC' }, // FEFO: earliest expiry first
        });

        if (batches.length === 0) {
            throw new InsufficientStockException(
                `No stock available for product ${productId} at branch ${branchId}`,
            );
        }

        const allocations: BatchAllocation[] = [];
        let remaining = quantityNeeded;

        for (const batch of batches) {
            if (remaining <= 0) break;

            const allocate = Math.min(Number(batch.quantityOnHand), remaining);

            allocations.push({
                batchId: batch.batchId,
                batchNo: batch.batchNo,
                quantity: allocate,
                expiryDate: batch.expiryDate,
                costPrice: Number(batch.costPrice),
            });

            remaining -= allocate;
        }

        if (remaining > 0) {
            const totalAvailable = batches.reduce(
                (sum, b) => sum + Number(b.quantityOnHand),
                0,
            );
            throw new InsufficientStockException(
                `Insufficient stock for product ${productId}. Requested: ${quantityNeeded}, Available: ${totalAvailable}, Short by: ${remaining} units`,
            );
        }

        return allocations;
    }

    /**
     * Get batches nearing expiry (within threshold days)
     */
    async getNearExpiryBatches(
        branchId: string,
        thresholdDays: number = 90,
    ): Promise<ProductBatch[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + thresholdDays);

        return this.batchRepository
            .createQueryBuilder('batch')
            .where('batch.branch_id = :branchId', { branchId })
            .andWhere('batch.expiry_date <= :thresholdDate', { thresholdDate })
            .andWhere('batch.expiry_date > :today', { today: new Date() })
            .andWhere('batch.quantity_on_hand > 0')
            .orderBy('batch.expiry_date', 'ASC')
            .getMany();
    }

    /**
     * Get expired batches with remaining stock
     */
    async getExpiredBatches(branchId: string): Promise<ProductBatch[]> {
        return this.batchRepository.find({
            where: {
                branchId,
                expiryDate: MoreThan(new Date()),
                quantityOnHand: MoreThan(0),
            },
            order: { expiryDate: 'ASC' },
        });
    }
}
