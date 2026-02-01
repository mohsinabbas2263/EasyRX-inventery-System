import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('inventory_ledger')
@Index(['productId', 'batchId', 'branchId'])
@Index(['branchId', 'postedAt'])
export class InventoryLedger {
    @PrimaryGeneratedColumn('uuid', { name: 'ledger_id' })
    ledgerId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({ name: 'batch_id', type: 'uuid' })
    batchId!: string;

    @Column({ name: 'document_type', length: 50 })
    documentType!: string; // 'SALE', 'PURCHASE', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT'

    @Column({ name: 'document_id', type: 'uuid' })
    documentId!: string;

    @Column({ name: 'qty_in', type: 'decimal', precision: 10, scale: 2, default: 0 })
    qtyIn!: number;

    @Column({ name: 'qty_out', type: 'decimal', precision: 10, scale: 2, default: 0 })
    qtyOut!: number;

    @Column({ name: 'unit_cost', type: 'decimal', precision: 10, scale: 2, nullable: true })
    unitCost!: number;

    @Column({ name: 'posted_at', type: 'timestamp' })
    postedAt!: Date;

    @Column({ name: 'posted_by', type: 'uuid' })
    postedBy!: string;

    @Column({ type: 'text', nullable: true })
    notes!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}
