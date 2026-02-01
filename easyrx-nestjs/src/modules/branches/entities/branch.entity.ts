import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('branches')
@Index(['companyId', 'code'], { unique: true })
export class Branch {
    @PrimaryGeneratedColumn('uuid', { name: 'branch_id' })
    branchId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 20 })
    code!: string; // Short code for the branch

    @Column({ name: 'address_line1', type: 'text', nullable: true })
    addressLine1?: string;

    @Column({ name: 'address_line2', type: 'text', nullable: true })
    addressLine2?: string;

    @Column({ length: 50, nullable: true })
    city?: string;

    @Column({ length: 20, nullable: true })
    phone?: string;

    @Column({ length: 100, nullable: true })
    email?: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company!: Company;
}
