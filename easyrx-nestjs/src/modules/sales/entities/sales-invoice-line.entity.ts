import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SalesInvoice } from './sales-invoice.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';

const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('sales_invoice_lines')
export class SalesInvoiceLine {
  @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
  lineId!: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  @Index()
  saleId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ name: 'batch_id', type: 'uuid' })
  batchId!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  quantity!: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  unitPrice!: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  discountAmount!: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
    default: 0,
  })
  taxAmount!: number;

  @Column({
    name: 'net_total',
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  netTotal!: number;

  @ManyToOne(() => SalesInvoice)
  @JoinColumn({ name: 'sale_id' })
  sale!: SalesInvoice;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => ProductBatch)
  @JoinColumn({ name: 'batch_id' })
  batch!: ProductBatch;
}
