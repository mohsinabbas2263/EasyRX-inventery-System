import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('suppliers')
@Index(['companyId', 'name'])
export class Supplier {
    @PrimaryGeneratedColumn('uuid', { name: 'supplier_id' })
    supplierId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ name: 'contact_person', length: 255, nullable: true })
    contactPerson?: string;

    @Column({ length: 100, nullable: true })
    email?: string;

    @Column({ length: 20, nullable: true })
    phone?: string;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ name: 'tax_number', length: 50, nullable: true })
    taxNumber?: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;
}
