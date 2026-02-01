import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('sales_invoices')
@Index(['companyId', 'branchId', 'saleDate'])
@Index(['saleNumber'], { unique: true })
export class SalesInvoice {
  @PrimaryGeneratedColumn('uuid', { name: 'sale_id' })
  saleId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'customer_id', type: 'uuid', nullable: true })
  customerId?: string;

  @Column({ name: 'sale_number', length: 50 })
  saleNumber!: string;

  @Column({ name: 'sale_date', type: 'timestamp' })
  saleDate!: Date;

  @Column({
    name: 'gross_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  grossTotal!: number;

  @Column({
    name: 'discount_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  discountTotal!: number;

  @Column({
    name: 'tax_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  taxTotal!: number;

  @Column({
    name: 'net_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  netTotal!: number;

  @Column({ name: 'payment_method', length: 30 })
  paymentMethod!: string; // 'CASH', 'CARD', 'CREDIT'

  @Column({ length: 30, default: 'DRAFT' })
  status!: string; // 'DRAFT', 'POSTED', 'CANCELLED'

  @Column({ name: 'local_uuid', type: 'uuid', nullable: true, unique: true })
  localUuid?: string; // For offline sync mapping

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string;
}
