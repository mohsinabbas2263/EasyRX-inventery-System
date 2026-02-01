import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../products/entities/product.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('purchase_order_lines')
export class PurchaseOrderLine {
    @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
    lineId!: string;

    @Column({ name: 'po_id', type: 'uuid' })
    @Index()
    poId!: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId!: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: numericTransformer,
    })
    quantity!: number;

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

    @ManyToOne(() => PurchaseOrder)
    @JoinColumn({ name: 'po_id' })
    purchaseOrder!: PurchaseOrder;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product!: Product;
}
