import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid', { name: 'product_id' })
    productId: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId: string;

    @Column({ name: 'brand_name', length: 200 })
    brandName: string;

    @Column({ name: 'generic_name', length: 200, nullable: true })
    genericName: string;

    @Column({ length: 100, nullable: true })
    strength: string;

    @Column({ name: 'dosage_form', length: 100, nullable: true })
    dosageForm: string;

    @Column({ name: 'manufacturer_id', type: 'uuid', nullable: true })
    manufacturerId: string;

    @Column({ name: 'pack_structure', length: 200, nullable: true })
    packStructure: string;

    @Column({ name: 'sale_unit', length: 50, nullable: true })
    saleUnit: string;

    @Column({ name: 'purchase_unit', length: 50, nullable: true })
    purchaseUnit: string;

    @Column({ name: 'is_medicine', default: true })
    isMedicine: boolean;

    @Column({ name: 'is_controlled', default: false })
    isControlled: boolean;

    @Column({ name: 'is_cold_chain', default: false })
    isColdChain: boolean;

    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    categoryId: string;

    @Column({ name: 'min_stock', type: 'numeric', precision: 14, scale: 3, nullable: true })
    minStock: number;

    @Column({ name: 'max_stock', type: 'numeric', precision: 14, scale: 3, nullable: true })
    maxStock: number;

    @Column({ name: 'reorder_point', type: 'numeric', precision: 14, scale: 3, nullable: true })
    reorderPoint: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
