import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn('uuid', { name: 'company_id' })
    companyId!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ length: 100, unique: true })
    subdomain!: string; // For multi-tenant routing

    @Column({ length: 20, nullable: true })
    registrationNumber?: string;

    @Column({ length: 20, nullable: true })
    taxNumber?: string;

    @Column({ name: 'address_line1', type: 'text', nullable: true })
    addressLine1?: string;

    @Column({ name: 'address_line2', type: 'text', nullable: true })
    addressLine2?: string;

    @Column({ length: 50, nullable: true })
    city?: string;

    @Column({ length: 50, nullable: true })
    state?: string;

    @Column({ length: 10, nullable: true })
    zipCode?: string;

    @Column({ length: 50, default: 'Pakistan' })
    country!: string;

    @Column({ length: 20, nullable: true })
    phone?: string;

    @Column({ length: 100, nullable: true })
    email?: string;

    @Column({ length: 255, nullable: true })
    logoUrl?: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
