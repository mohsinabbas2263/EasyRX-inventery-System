import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('controlled_dispense_logs')
export class ControlledDispenseLog {
    @PrimaryGeneratedColumn('uuid', { name: 'dispense_id' })
    dispenseId: string;

    @Column({ name: 'company_id', type: 'uuid' })
    companyId: string;

    @Column({ name: 'branch_id', type: 'uuid' })
    branchId: string;

    @Column({ name: 'prescription_ref' })
    prescriptionRef: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'batch_id', type: 'uuid' })
    batchId: string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    qty: number;

    @Column({ name: 'pharmacist_id', type: 'uuid' })
    pharmacistId: string;

    @Column({ name: 'patient_name', type: 'varchar', nullable: true })
    patientName: string | null;

    @Column({ name: 'patient_cnic', type: 'varchar', nullable: true })
    patientCnic: string | null;

    @CreateDateColumn({ name: 'dispensed_at' })
    dispensedAt: Date;
}
