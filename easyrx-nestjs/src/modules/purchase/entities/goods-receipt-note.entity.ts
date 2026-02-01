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
import { PurchaseOrder } from './purchase-order.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('goods_receipt_notes')
@Index(['companyId', 'branchId'])
export class GoodsReceiptNote {
    @PrimaryGeneratedColumn('uuid', { name: 'grn_id' })
    grnId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'supplier_id', type: 'uuid' })
    supplierId!: string;

    @Column({ name: 'po_id', type: 'uuid', nullable: true })
    poId?: string;

    @Column({ name: 'grn_number', length: 50, unique: true })
    grnNumber!: string;

    @Column({ name: 'receipt_date', type: 'date' })
    receiptDate!: Date;

    @Column({ name: 'supplier_invoice_number', length: 50, nullable: true })
    supplierInvoiceNumber?: string;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
    })
    totalAmount!: number;

    @Column({ length: 30, default: 'POSTED' })
    status!: string; // 'DRAFT', 'POSTED', 'CANCELLED'

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @ManyToOne(() => Supplier)
    @JoinColumn({ name: 'supplier_id' })
    supplier!: Supplier;

    @ManyToOne(() => PurchaseOrder)
    @JoinColumn({ name: 'po_id' })
    purchaseOrder?: PurchaseOrder;
}
