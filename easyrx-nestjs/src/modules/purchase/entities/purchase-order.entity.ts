import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('purchase_orders')
@Index(['companyId', 'branchId'])
export class PurchaseOrder {
    @PrimaryGeneratedColumn('uuid', { name: 'po_id' })
    poId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'supplier_id', type: 'uuid' })
    supplierId!: string;

    @Column({ name: 'po_number', length: 50, unique: true })
    poNumber!: string;

    @Column({ name: 'order_date', type: 'date' })
    orderDate!: Date;

    @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
    expectedDeliveryDate?: Date;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
    })
    totalAmount!: number;

    @Column({ length: 30, default: 'DRAFT' })
    status!: string; // 'DRAFT', 'ORDERED', 'RECEIVED', 'CANCELLED'

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier!: Supplier;
}
