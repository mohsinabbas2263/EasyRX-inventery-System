import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  InventoryLedger,
  MovementType,
  AdjustmentReason,
} from '../entities/inventory-ledger.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateMovementDto } from '../dto/create-movement.dto';
import { CycleCountDto, AdjustmentDto } from '../dto/adjustment.dto';
import { StockService } from './stock.service';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(InventoryLedger)
    private ledgerRepository: Repository<InventoryLedger>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private stockService: StockService,
    private dataSource: DataSource,
  ) {}

  async createMovement(
    dto: CreateMovementDto,
    currentUserId: string,
  ): Promise<InventoryLedger[]> {
    // Validate movement type
    const inboundTypes = [
      MovementType.PURCHASE,
      MovementType.RETURN_IN,
      MovementType.TRANSFER_IN,
      MovementType.ADJUSTMENT,
      MovementType.COUNT,
    ];
    const outboundTypes = [
      MovementType.SALE,
      MovementType.RETURN_OUT,
      MovementType.TRANSFER_OUT,
      MovementType.ADJUSTMENT,
    ];

    const isInbound = inboundTypes.includes(dto.movementType);
    const isOutbound = outboundTypes.includes(dto.movementType);

    // Validate product exists
    const product = await this.productRepository.findOne({
      where: { productId: dto.productId },
    });
    if (!product) {
      throw new BadRequestException(`Product ${dto.productId} not found`);
    }

    // For medicines, batch is mandatory
    if (product.isMedicine && !dto.batchId && isInbound) {
      throw new BadRequestException('Batch is mandatory for medicines');
    }

    // Check negative stock for outbound
    if (isOutbound) {
      const currentStock = await this.getCurrentStock(
        dto.branchId,
        dto.productId,
        dto.batchId,
      );

      if (currentStock < dto.qty && !dto.allowNegativeStock) {
        throw new BadRequestException(
          `Insufficient stock. Required: ${dto.qty}, Available: ${currentStock}`,
        );
      }
    }

    // For SALE with medicines, use FEFO batch picking
    if (dto.movementType === MovementType.SALE && product.isMedicine) {
      return this.createSaleWithFefo(dto, currentUserId);
    }

    // Create single ledger entry
    const ledgerEntry = this.ledgerRepository.create({
      branchId: dto.branchId,
      productId: dto.productId,
      batchId: dto.batchId,
      binId: dto.binId,
      movementType: dto.movementType,
      qtyIn: isInbound ? dto.qty : 0,
      qtyOut: isOutbound ? dto.qty : 0,
      reason: dto.reason,
      unitCost: dto.unitCost,
      referenceDocType: dto.referenceDocType,
      referenceDocId: dto.referenceDocId,
      createdBy: currentUserId,
      postedAt: new Date(),
    });

    const saved = await this.ledgerRepository.save(ledgerEntry);
    await this.stockService.invalidateStockCache(dto.branchId);
    return [saved];
  }

  private async createSaleWithFefo(
    dto: CreateMovementDto,
    currentUserId: string,
  ): Promise<InventoryLedger[]> {
    const picks = await this.stockService.pickBatchesForSale(
      dto.branchId,
      dto.productId,
      dto.qty,
    );

    const createdEntries: InventoryLedger[] = [];

    for (const pick of picks) {
      const ledgerEntry = this.ledgerRepository.create({
        branchId: dto.branchId,
        productId: dto.productId,
        batchId: pick.batchId,
        binId: dto.binId,
        movementType: MovementType.SALE,
        qtyOut: pick.qtyFromBatch,
        referenceDocType: dto.referenceDocType,
        referenceDocId: dto.referenceDocId,
        createdBy: currentUserId,
        postedAt: new Date(),
      });

      const saved = await this.ledgerRepository.save(ledgerEntry);
      createdEntries.push(saved);
    }

    await this.stockService.invalidateStockCache(dto.branchId);
    return createdEntries;
  }

  async applyCycleCount(
    dto: CycleCountDto,
    currentUserId: string,
  ): Promise<InventoryLedger | null> {
    const currentStock = await this.getCurrentStock(
      dto.branchId,
      dto.productId,
      dto.batchId,
    );

    const variance = dto.countedQty - currentStock;

    if (variance === 0) {
      // No adjustment needed
      return null;
    }

    // Create adjustment movement
    const adjustmentDto: CreateMovementDto = {
      branchId: dto.branchId,
      productId: dto.productId,
      batchId: dto.batchId,
      binId: dto.binId,
      movementType: MovementType.ADJUSTMENT,
      qty: Math.abs(variance),
      reason: AdjustmentReason.CYCLE_COUNT,
      referenceDocType: undefined,
      referenceDocId: undefined,
      allowNegativeStock: variance < 0, // Allow negative if shrinkage
    };

    if (variance > 0) {
      adjustmentDto.movementType = MovementType.ADJUSTMENT;
    } else {
      adjustmentDto.movementType = MovementType.ADJUSTMENT;
    }

    const [adjustmentEntry] = await this.createMovement(
      adjustmentDto,
      currentUserId,
    );
    return adjustmentEntry;
  }

  async createAdjustment(
    dto: AdjustmentDto,
    currentUserId: string,
  ): Promise<InventoryLedger> {
    const movementDto: CreateMovementDto = {
      branchId: dto.branchId,
      productId: dto.productId,
      batchId: dto.batchId,
      binId: dto.binId,
      movementType: MovementType.ADJUSTMENT,
      qty: dto.qty,
      reason: dto.reason,
      allowNegativeStock: false,
    };

    const [entry] = await this.createMovement(movementDto, currentUserId);
    return entry;
  }

  private async getCurrentStock(
    branchId: string,
    productId: string,
    batchId?: string,
  ): Promise<number> {
    let query = this.dataSource
      .createQueryBuilder()
      .select('COALESCE(SUM(il.qty_in - il.qty_out), 0)', 'stock')
      .from('inventory_ledger', 'il')
      .where('il.branch_id = :branchId', { branchId })
      .andWhere('il.product_id = :productId', { productId });

    if (batchId) {
      query = query.andWhere('il.batch_id = :batchId', { batchId });
    }

    const result = await query.getRawOne();
    return parseFloat(result.stock) || 0;
  }
}
