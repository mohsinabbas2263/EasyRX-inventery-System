import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';
import { TenantContextService } from '../../../common/services/tenant-context.service';

export interface StockMovement {
  productId: string;
  batchId: string;
  branchId: string;
  documentType: string;
  documentId: string;
  qtyIn?: number;
  qtyOut?: number;
  unitCost?: number;
  postedBy: string;
  notes?: string;
}

@Injectable()
export class StockLedgerService {
  constructor(
    @InjectRepository(InventoryLedger)
    private ledgerRepository: Repository<InventoryLedger>,
    private readonly tenantContext: TenantContextService,
    private dataSource: DataSource,
  ) { }

  /**
   * Post a stock movement to the ledger
   * This is a CRITICAL operation - uses transaction to ensure atomicity
   */
  async postMovement(movement: StockMovement): Promise<InventoryLedger> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.postMovementWithManager(
        queryRunner.manager,
        movement,
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Internal implementation of postMovement that accepts an EntityManager
   * Useful for transactions spanning across multiple services
   */
  async postMovementWithManager(
    manager: EntityManager,
    movement: StockMovement,
  ): Promise<InventoryLedger> {
    // Validate movement
    if ((movement.qtyIn || 0) > 0 && (movement.qtyOut || 0) > 0) {
      throw new BadRequestException(
        'Cannot have both qtyIn and qtyOut in the same movement',
      );
    }

    if ((movement.qtyIn || 0) === 0 && (movement.qtyOut || 0) === 0) {
      throw new BadRequestException(
        'Movement must have either qtyIn or qtyOut',
      );
    }

    // Get current batch
    const batch = await manager.findOne(ProductBatch, {
      where: { batchId: movement.batchId },
      lock: { mode: 'pessimistic_write' }, // Lock row for update
    });

    if (!batch) {
      throw new BadRequestException(`Batch ${movement.batchId} not found`);
    }

    // Calculate new quantity
    const currentQty = Number(batch.quantityOnHand);
    const qtyChange = (movement.qtyIn || 0) - (movement.qtyOut || 0);
    const newQty = currentQty + qtyChange;

    // CRITICAL: Prevent negative stock
    if (newQty < 0) {
      throw new BadRequestException(
        `Stock cannot be negative. Current: ${currentQty}, Requested out: ${movement.qtyOut}, Would result in: ${newQty}`,
      );
    }

    // Update batch quantity
    await manager.update(
      ProductBatch,
      { batchId: movement.batchId },
      { quantityOnHand: newQty },
    );

    // Create ledger entry
    const ledgerEntry = manager.create(InventoryLedger, {
      ...movement,
      companyId: this.tenantContext.companyId!,
      qtyIn: movement.qtyIn || 0,
      qtyOut: movement.qtyOut || 0,
      postedAt: new Date(),
    });

    return await manager.save(ledgerEntry);
  }

  /**
   * Post multiple movements atomically
   */
  async postMultipleMovements(
    movements: StockMovement[],
  ): Promise<InventoryLedger[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedEntries: InventoryLedger[] = [];
      for (const movement of movements) {
        savedEntries.push(
          await this.postMovementWithManager(queryRunner.manager, movement),
        );
      }
      await queryRunner.commitTransaction();
      return savedEntries;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get stock on hand for a product at a branch
   */
  async getStockOnHand(productId: string, branchId: string) {
    const result = await this.ledgerRepository
      .createQueryBuilder('ledger')
      .select('ledger.batch_id', 'batchId')
      .addSelect('batch.batch_no', 'batchNo')
      .addSelect(
        'SUM(CAST(ledger.qty_in AS DECIMAL) - CAST(ledger.qty_out AS DECIMAL))',
        'quantity',
      )
      .innerJoin(ProductBatch, 'batch', 'batch.batch_id = ledger.batch_id')
      .where('ledger.product_id = :productId', { productId })
      .andWhere('ledger.branch_id = :branchId', { branchId })
      .andWhere('ledger.company_id = :companyId', { companyId: this.tenantContext.companyId })
      .groupBy('ledger.batch_id')
      .addGroupBy('batch.batch_no')
      .having(
        'SUM(CAST(ledger.qty_in AS DECIMAL) - CAST(ledger.qty_out AS DECIMAL)) > 0',
      )
      .getRawMany();

    return result.map((r) => ({
      batchId: r.batchId,
      batchNo: r.batchNo,
      quantity: Number(r.quantity),
    }));
  }
}
