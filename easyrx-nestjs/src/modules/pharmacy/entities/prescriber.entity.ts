import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('prescribers')
@Index(['companyId', 'licenseNumber'])
export class Prescriber {
    @PrimaryGeneratedColumn('uuid', { name: 'prescriber_id' })
    prescriberId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ length: 100, nullable: true })
    specialty?: string;

    @Column({ name: 'license_number', length: 50, nullable: true })
    licenseNumber?: string;

    @Column({ length: 20, nullable: true })
    phone?: string;

    @Column({ length: 100, nullable: true })
    email?: string;

    @Column({ name: 'clinic_name', length: 255, nullable: true })
    clinicName?: string;

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;
}
