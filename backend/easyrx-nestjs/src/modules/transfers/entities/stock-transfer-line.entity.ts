import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { StockTransfer } from './stock-transfer.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';

const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('stock_transfer_lines')
export class StockTransferLine {
  @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
  lineId!: string;

  @Column({ name: 'transfer_id', type: 'uuid' })
  @Index()
  transferId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  @Index()
  productId!: string;

  @Column({ name: 'batch_id', type: 'uuid', nullable: true })
  @Index()
  batchId?: string;

  @Column({
    name: 'qty_requested',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  qtyRequested!: number;

  @Column({
    name: 'qty_dispatched',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  qtyDispatched!: number;

  @Column({
    name: 'qty_received',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  qtyReceived!: number;

  @ManyToOne(() => StockTransfer, (transfer) => transfer.lines)
  @JoinColumn({ name: 'transfer_id' })
  transfer!: StockTransfer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => ProductBatch)
  @JoinColumn({ name: 'batch_id' })
  batch!: ProductBatch;
}
