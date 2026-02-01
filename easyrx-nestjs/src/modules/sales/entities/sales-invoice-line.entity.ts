import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { SalesInvoice } from './sales-invoice.entity';
const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => value === null ? null : parseFloat(value),
};
@Entity('sales_invoice_lines')
export class SalesInvoiceLine {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @RelationId((line: SalesInvoiceLine) => line.salesInvoice)
    saleId: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'batch_id', type: 'uuid', nullable: true })
    batchId: string;

    @Column({ name: 'qty', type: 'numeric', precision: 14, scale: 3, transformer: numericTransformer })
    qty: number;

    @Column({ name: 'unit_price', type: 'numeric', precision: 14, scale: 4, transformer: numericTransformer })
    unitPrice: number;

    @Column({ name: 'discount', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    discount: number | null;

    @Column({ name: 'tax_amount', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    taxAmount: number | null;

    @Column({ name: 'line_total', type: 'numeric', precision: 14, scale: 2, nullable: true, transformer: numericTransformer })
    lineTotal: number | null;

    @Column({ name: 'is_controlled', default: false })
    isControlled: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => SalesInvoice)
    @JoinColumn({ name: 'sale_id' })
    salesInvoice: SalesInvoice;
}
