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
import { Customer } from './customer.entity';
import { Prescriber } from './prescriber.entity';

@Entity('prescriptions')
@Index(['companyId', 'prescriptionDate'])
export class Prescription {
    @PrimaryGeneratedColumn('uuid', { name: 'prescription_id' })
    prescriptionId!: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId!: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId!: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId!: string;

    @Column({ name: 'prescriber_id', type: 'uuid' })
    prescriberId!: string;

    @Column({ name: 'prescription_number', length: 50, unique: true })
    prescriptionNumber!: string;

    @Column({ name: 'prescription_date', type: 'date' })
    prescriptionDate!: Date;

    @Column({ length: 30, default: 'PENDING' })
    status!: string; // 'PENDING', 'DISPENSED', 'CANCELLED'

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @Column({ name: 'created_by', type: 'uuid' })
    createdBy!: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer!: Customer;

    @ManyToOne(() => Prescriber)
    @JoinColumn({ name: 'prescriber_id' })
    prescriber!: Prescriber;
}
