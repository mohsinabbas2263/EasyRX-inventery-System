import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_batches')
export class ProductBatch {
    @PrimaryGeneratedColumn('uuid', { name: 'batch_id' })
    batchId: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'batch_no', length: 100 })
    batchNo: string;

    @Column({ name: 'expiry_date', type: 'date', nullable: true })
    expiryDate: Date;

    @Column({ name: 'is_quarantined', default: false })
    isQuarantined: boolean;

    @Column({ name: 'is_expired', default: false })
    isExpired: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}
