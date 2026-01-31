import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => value === null ? null : parseFloat(value),
};

@Entity('sales_invoices')
export class SalesInvoice {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId: string;

    @Column({ name: 'counter_id', type: 'uuid', nullable: true })
    counterId: string;

    @Column({ name: 'customer_id', type: 'uuid', nullable: true })
    customerId: string;

    @Column({ name: 'prescription_id', type: 'uuid', nullable: true })
    prescriptionId: string;

    @Column({ name: 'sale_number', length: 50, nullable: true })
    saleNumber: string;

    @Column({ name: 'sale_date', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    saleDate: Date;

    @Column({ name: 'gross_total', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    grossTotal: number | null;

    @Column({ name: 'discount_total', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    discountTotal: number | null;

    @Column({ name: 'tax_total', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    taxTotal: number | null;

    @Column({ name: 'net_total', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    netTotal: number | null;

    @Column({ name: 'cost_of_goods_sold', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    costOfGoodsSold: number | null;

    @Column({ name: 'payment_method', length: 30, nullable: true })
    paymentMethod: string;

    @Column({ name: 'status', length: 30, default: 'DRAFT' })
    status: string;

    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdBy: string;

    @Column({ name: 'posted_at', type: 'timestamptz', nullable: true })
    postedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
