import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';

export enum MovementType {
    PURCHASE = 'PURCHASE',
    SALE = 'SALE',
    RETURN_IN = 'RETURN_IN',
    RETURN_OUT = 'RETURN_OUT',
    TRANSFER_IN = 'TRANSFER_IN',
    TRANSFER_OUT = 'TRANSFER_OUT',
    ADJUSTMENT = 'ADJUSTMENT',
    COUNT = 'COUNT',
}

export enum AdjustmentReason {
    DAMAGED = 'DAMAGED',
    EXPIRED = 'EXPIRED',
    SHRINKAGE = 'SHRINKAGE',
    CYCLE_COUNT = 'CYCLE_COUNT',
    THEFT = 'THEFT',
    OTHER = 'OTHER',
}

export enum ReferenceDocType {
    GRN = 'GRN',
    SALE = 'SALE',
    TRANSFER = 'TRANSFER',
    ADJUSTMENT = 'ADJUSTMENT',
    COUNT = 'COUNT',
}

@Entity('inventory_ledger')
@Index('idx_inventory_branch_product_batch', ['branchId', 'productId', 'batchId'])
@Index('idx_inventory_branch_posted', ['branchId', 'postedAt'])
@Index('idx_inventory_product_batch', ['productId', 'batchId'])
@Index('idx_inventory_batch_expiry', ['batchId', 'postedAt'])
export class InventoryLedger {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    branchId: string;

    @Column({ type: 'uuid' })
    productId: string;

    @Column({ type: 'uuid', nullable: true })
    batchId: string;

    @Column({ type: 'uuid', nullable: true })
    binId: string;

    @Column({ type: 'varchar', length: 50 })
    movementType: MovementType;

    @Column({ type: 'numeric', precision: 14, scale: 3, default: 0 })
    qtyIn: number;

    @Column({ type: 'numeric', precision: 14, scale: 3, default: 0 })
    qtyOut: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    reason: AdjustmentReason | null;

    @Column({ type: 'numeric', precision: 14, scale: 4, nullable: true })
    unitCost: number | null;

    @Column({ type: 'varchar', length: 50, nullable: true })
    referenceDocType: ReferenceDocType | null;

    @Column({ type: 'uuid', nullable: true })
    referenceDocId: string | null;

    @Column({ type: 'uuid', nullable: true })
    createdBy: string | null;

    @CreateDateColumn()
    postedAt: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @ManyToOne(() => ProductBatch, { nullable: true })
    @JoinColumn({ name: 'batchId' })
    batch: ProductBatch;
}
