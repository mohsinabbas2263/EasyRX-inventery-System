import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import { InventoryLedger, MovementType } from '../entities/inventory-ledger.entity';
import { StockLevel } from '../entities/stock-level.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';
import { StockQueryDto } from '../dto/stock-query.dto';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(InventoryLedger)
        private ledgerRepository: Repository<InventoryLedger>,
        @InjectRepository(StockLevel)
        private stockLevelRepository: Repository<StockLevel>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductBatch)
        private batchRepository: Repository<ProductBatch>,
        private dataSource: DataSource,
        // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async getCurrentStock(query: StockQueryDto): Promise<any[]> {
        // const cacheKey = `stock:${JSON.stringify(query)}`;
        // const cached = await this.cacheManager.get(cacheKey);
        // if (cached) return cached;

        const qb = this.dataSource
            .createQueryBuilder()
            .select([
                'il.branch_id as branchId',
                'il.product_id as productId',
                'p.brand_name as productName',
                'p.category',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as qtyOnHand',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('products', 'p', 'p.id = il.product_id')
            .where('il.branch_id = :branchId', { branchId: query.branchId });

        if (query.productId) {
            qb.andWhere('il.product_id = :productId', { productId: query.productId });
        }

        if (query.category) {
            qb.andWhere('p.category = :category', { category: query.category });
        }

        if (query.onlyNonExpired) {
            qb.andWhere(
                '(il.batch_id IS NULL OR NOT EXISTS (SELECT 1 FROM product_batches pb WHERE pb.id = il.batch_id AND pb.expiry_date < CURRENT_DATE))',
            );
        }

        qb.groupBy('il.branch_id, il.product_id, p.brand_name, p.category');

        if (query.onlyPositive) {
            qb.having('COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0');
        }

        qb.orderBy('p.brand_name', 'ASC')
            .limit(query.limit)
            .offset(query.offset);

        const results = await qb.getRawMany();

        if (query.includeBatches) {
            for (const result of results) {
                result.batches = await this.getBatchesForProduct(
                    query.branchId,
                    result.productId,
                    query.includeBins,
                );
            }
        }

        // await this.cacheManager.set(cacheKey, results);
        return results;
    }

    private async getBatchesForProduct(
        branchId: string,
        productId: string,
        includeBins: boolean,
    ): Promise<any[]> {
        const query = this.dataSource
            .createQueryBuilder()
            .select([
                'il.batch_id as batchId',
                'pb.batch_no as batchNo',
                'pb.expiry_date as expiryDate',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as qtyOnHand',
                'MAX(il.posted_at) as lastMovementDate',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('product_batches', 'pb', 'pb.id = il.batch_id')
            .where('il.branch_id = :branchId', { branchId })
            .andWhere('il.product_id = :productId', { productId })
            .groupBy('il.batch_id, pb.batch_no, pb.expiry_date')
            .having('COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0');

        const batches = await query.getRawMany();

        if (includeBins) {
            for (const batch of batches) {
                batch.bins = await this.getBinsForBatch(branchId, productId, batch.batchId);
            }
        }

        return batches;
    }

    private async getBinsForBatch(
        branchId: string,
        productId: string,
        batchId: string,
    ): Promise<any[]> {
        const query = this.dataSource
            .createQueryBuilder()
            .select([
                'il.bin_id as binId',
                'bl.code as binCode',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as qtyOnHand',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('bin_locations', 'bl', 'bl.id = il.bin_id')
            .where('il.branch_id = :branchId', { branchId })
            .andWhere('il.product_id = :productId', { productId })
            .andWhere('il.batch_id = :batchId', { batchId })
            .groupBy('il.bin_id, bl.code')
            .having('COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0');

        return query.getRawMany();
    }

    async getNearExpiry(branchId: string, days: number = 90): Promise<any[]> {
        // const cacheKey = `near-expiry:${branchId}:${days}`;
        // const cached = await this.cacheManager.get(cacheKey);
        // if (cached) return cached;

        const result = await this.dataSource
            .createQueryBuilder()
            .select([
                'p.id as productId',
                'p.brand_name as productName',
                'pb.id as batchId',
                'pb.batch_no as batchNo',
                'pb.expiry_date as expiryDate',
                '(pb.expiry_date - CURRENT_DATE) as daysToExpiry',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as qtyOnHand',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('products', 'p', 'p.id = il.product_id')
            .leftJoin('product_batches', 'pb', 'pb.id = il.batch_id')
            .where('il.branch_id = :branchId', { branchId })
            .andWhere('pb.expiry_date IS NOT NULL')
            .andWhere('pb.expiry_date <= CURRENT_DATE + INTERVAL :days days', { days })
            .andWhere('pb.expiry_date > CURRENT_DATE')
            .groupBy('p.id, p.brand_name, pb.id, pb.batch_no, pb.expiry_date')
            .having('COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0')
            .orderBy('pb.expiry_date', 'ASC')
            .getRawMany();

        // await this.cacheManager.set(cacheKey, result);
        return result;
    }

    async getDeadStock(
        branchId: string,
        minDays: number = 180,
        minQty: number = 1,
    ): Promise<any[]> {
        // const cacheKey = `dead-stock:${branchId}:${minDays}:${minQty}`;
        // const cached = await this.cacheManager.get(cacheKey);
        // if (cached) return cached;

        const result = await this.dataSource
            .createQueryBuilder()
            .select([
                'p.id as productId',
                'p.brand_name as productName',
                'p.category',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as qtyOnHand',
                'MAX(il.posted_at) as lastMovementDate',
                '(CURRENT_DATE - CAST(MAX(il.posted_at) AS DATE)) as daysSinceMovement',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('products', 'p', 'p.id = il.product_id')
            .where('il.branch_id = :branchId', { branchId })
            .andWhere('NOT EXISTS (SELECT 1 FROM inventory_ledger il2 WHERE il2.product_id = il.product_id AND il2.branch_id = il.branch_id AND il2.movement_type IN (:...outMovements) AND il2.posted_at > CURRENT_DATE - INTERVAL :days days)', {
                outMovements: [MovementType.SALE, MovementType.TRANSFER_OUT, MovementType.RETURN_OUT],
                days: minDays,
            })
            .groupBy('p.id, p.brand_name, p.category')
            .having('COALESCE(SUM(il.qty_in - il.qty_out), 0) >= :minQty', { minQty })
            .orderBy('MAX(il.posted_at)', 'ASC')
            .getRawMany();

        // await this.cacheManager.set(cacheKey, result);
        return result;
    }

    async pickBatchesForSale(
        branchId: string,
        productId: string,
        requiredQty: number,
    ): Promise<{ batchId: string; qtyFromBatch: number }[]> {
        // Get non-expired batches sorted by FEFO (earliest expiry first)
        const availableBatches = await this.dataSource
            .createQueryBuilder()
            .select([
                'il.batch_id as batchId',
                'pb.expiry_date as expiryDate',
                'COALESCE(SUM(il.qty_in - il.qty_out), 0) as availableQty',
            ])
            .from('inventory_ledger', 'il')
            .leftJoin('product_batches', 'pb', 'pb.id = il.batch_id')
            .where('il.branch_id = :branchId', { branchId })
            .andWhere('il.product_id = :productId', { productId })
            .andWhere('(pb.expiry_date IS NULL OR pb.expiry_date >= CURRENT_DATE)')
            .groupBy('il.batch_id, pb.expiry_date')
            .having('COALESCE(SUM(il.qty_in - il.qty_out), 0) > 0')
            .orderBy('pb.expiry_date', 'ASC')
            .addOrderBy('il.posted_at', 'ASC')
            .getRawMany();

        if (!availableBatches.length) {
            throw new BadRequestException(
                `No stock available for product ${productId} in branch ${branchId}`,
            );
        }

        const picks: { batchId: string; qtyFromBatch: number }[] = [];
        let remainingQty = requiredQty;

        for (const batch of availableBatches) {
            const qtyToTake = Math.min(remainingQty, parseFloat(batch.availableQty));
            picks.push({
                batchId: batch.batchId,
                qtyFromBatch: qtyToTake,
            });
            remainingQty -= qtyToTake;

            if (remainingQty <= 0) break;
        }

        if (remainingQty > 0) {
            throw new BadRequestException(
                `Insufficient stock for product ${productId}. Required: ${requiredQty}, Available: ${requiredQty - remainingQty}`,
            );
        }

        return picks;
    }

    async invalidateStockCache(branchId: string): Promise<void> {
        // Invalidate all cache entries for this branch
        // const pattern = `stock:*${branchId}*`;
        // const keys = await this.cacheManager.store.keys();
        // for (const key of keys) {
        //     if (key.includes(branchId)) {
        //         await this.cacheManager.del(key);
        //     }
        // }
    }
}
