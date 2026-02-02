import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum MovementType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  RETURN = 'RETURN',
  RETURN_IN = 'RETURN_IN',
  RETURN_OUT = 'RETURN_OUT',
  COUNT = 'COUNT',
}

export enum AdjustmentReason {
  CYCLE_COUNT = 'CYCLE_COUNT',
  EXPIRY = 'EXPIRY',
  DAMAGE = 'DAMAGE',
  LOST = 'LOST',
  FOUND = 'FOUND',
  OTHER = 'OTHER',
}

export enum ReferenceDocType {
  SALE = 'SALE',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  GRN = 'GRN',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
}

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

  @Column({ name: 'movement_type', length: 50, nullable: true })
  movementType!: string;

  @Column({ name: 'reference_doc_type', length: 50, nullable: true })
  referenceDocType!: string;

  @Column({ name: 'reference_doc_id', type: 'uuid', nullable: true })
  referenceDocId!: string;

  @Column({ name: 'bin_id', type: 'uuid', nullable: true })
  binId!: string;

  @Column({ name: 'reason', length: 100, nullable: true })
  reason!: string;

  @Column({
    name: 'qty_in',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  qtyIn!: number;

  @Column({
    name: 'qty_out',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  qtyOut!: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  unitCost!: number;

  @Column({ name: 'posted_at', type: 'timestamp' })
  postedAt!: Date;

  @Column({ name: 'posted_by', type: 'uuid' })
  postedBy!: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
