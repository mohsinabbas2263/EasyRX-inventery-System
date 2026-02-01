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

    @ManyToOne(() => StockTransfer)
    @JoinColumn({ name: 'transfer_id' })
    transfer!: StockTransfer;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => ProductBatch)
    @JoinColumn({ name: 'batch_id' })
    batch!: ProductBatch;
}
