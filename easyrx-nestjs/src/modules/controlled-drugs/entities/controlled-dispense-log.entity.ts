import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('controlled_dispense_logs')
export class ControlledDispenseLog {
    @PrimaryGeneratedColumn({ name: 'dispense_id', type: 'bigint' })
    dispenseId: number;

    @Column({ name: 'company_id', type: 'bigint' })
    companyId: number;

    @Column({ name: 'branch_id', type: 'bigint' })
    branchId: number;

    @Column({ name: 'prescription_ref' })
    prescriptionRef: string;

    @Column({ name: 'product_id', type: 'bigint' })
    productId: number;

    @Column({ name: 'batch_id', type: 'bigint' })
    batchId: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    qty: number;

    @Column({ name: 'pharmacist_id', type: 'bigint' })
    pharmacistId: number;

    @Column({ name: 'patient_name', type: 'varchar', nullable: true })
    patientName: string | null;

    @Column({ name: 'patient_cnic', type: 'varchar', nullable: true })
    patientCnic: string | null;

    @CreateDateColumn({ name: 'dispensed_at' })
    dispensedAt: Date;
}
