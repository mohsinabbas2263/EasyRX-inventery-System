import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('products')
@Index(['companyId', 'barcode1d'])
export class Product {
    @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
    productId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ name: 'brand_name', length: 255 })
    brandName!: string;

    @Column({ name: 'generic_name', length: 255, nullable: true })
    genericName!: string;

    @Column({ length: 100, nullable: true })
    strength!: string;

    @Column({ name: 'dosage_form', length: 100, nullable: true })
    dosageForm!: string;

    @Column({ name: 'barcode_1d', length: 50, nullable: true })
    barcode1d!: string;

    @Column({ name: 'is_controlled_drug', default: false })
    isControlledDrug!: boolean;

    @Column({ name: 'is_prescription_required', default: false })
    isPrescriptionRequired!: boolean;

    @Column({ name: 'reorder_level', type: 'decimal', precision: 10, scale: 2, default: 0 })
    reorderLevel!: number;

    @Column({ name: 'default_selling_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    defaultSellingPrice!: number;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @Column({ type: 'text', nullable: true })
    notes!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid', nullable: true })
    createdBy!: string;

    @Column({ name: 'updated_by', type: 'uuid', nullable: true })
    updatedBy!: string;
}
