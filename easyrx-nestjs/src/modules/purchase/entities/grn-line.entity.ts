import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { GoodsReceiptNote } from './goods-receipt-note.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('grn_lines')
export class GRNLine {
    @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
    lineId!: string;

    @Column({ name: 'grn_id', type: 'uuid' })
    @Index()
    grnId!: string;

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
    quantityReceived!: number;

    @Column({
        name: 'unit_cost',
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: numericTransformer,
    })
    unitCost!: number;

    @Column({
        name: 'net_total',
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
    })
    netTotal!: number;

    @ManyToOne(() => GoodsReceiptNote)
    @JoinColumn({ name: 'grn_id' })
    grn!: GoodsReceiptNote;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product;

    @ManyToOne(() => ProductBatch)
    @JoinColumn({ name: 'batch_id' })
    batch!: ProductBatch;
}
