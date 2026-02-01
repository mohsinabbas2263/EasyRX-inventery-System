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
import { SalesInvoice } from './sales-invoice.entity';

const numericTransformer = {
    to: (value: number | null) => value,
    from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('sales_returns')
@Index(['companyId', 'branchId'])
export class SalesReturn {
    @PrimaryGeneratedColumn('uuid', { name: 'return_id' })
    returnId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'sale_id', type: 'uuid' })
    saleId!: string;

    @Column({ name: 'return_number', length: 50, unique: true })
    returnNumber!: string;

    @Column({ name: 'return_date', type: 'timestamp' })
    returnDate!: Date;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 14,
        scale: 2,
        transformer: numericTransformer,
    })
    totalAmount!: number;

    @Column({ length: 30, default: 'POSTED' })
    status!: string;

    @Column({ type: 'text', nullable: true })
    reason?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @ManyToOne(() => SalesInvoice)
    @JoinColumn({ name: 'sale_id' })
    sale!: SalesInvoice;
}
