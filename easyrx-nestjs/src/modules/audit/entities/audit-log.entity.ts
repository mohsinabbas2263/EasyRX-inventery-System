import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn({ name: 'audit_id', type: 'bigint' })
    auditId: number;

    @Column({ name: 'company_id', type: 'bigint' })
    companyId: number;

    @Column({ name: 'user_id', type: 'bigint', nullable: true })
    userId: number | null;

    @Column({ name: 'branch_id', type: 'bigint', nullable: true })
    branchId: number | null;

    @Column()
    action: string;

    @Column({ name: 'entity_type' })
    entityType: string;

    @Column({ name: 'entity_id' })
    entityId: string;

    @Column({ type: 'jsonb', name: 'before_data', nullable: true })
    beforeData: any;

    @Column({ type: 'jsonb', name: 'after_data', nullable: true })
    afterData: any;

    @Column({ name: 'ip_address', type: 'varchar', nullable: true })
    ipAddress: string | null;

    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent: string | null;

    @Column({ name: 'request_id', type: 'varchar', nullable: true })
    requestId: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
