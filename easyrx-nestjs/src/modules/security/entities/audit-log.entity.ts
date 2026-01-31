import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index('idx_audit_user_id', ['userId'])
@Index('idx_audit_created_at', ['createdAt'])
@Index('idx_audit_action', ['action'])
@Index('idx_audit_entity', ['entityType', 'entityId'])
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    userId: string;

    @Column({ type: 'uuid', nullable: true })
    branchId: string;

    @Column({ type: 'uuid', nullable: true })
    companyId: string;

    @Column({ type: 'varchar', length: 100 })
    action: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    entityType: string;

    @Column({ type: 'uuid', nullable: true })
    entityId: string;

    @Column({ type: 'jsonb', nullable: true })
    beforeData: Record<string, any>;

    @Column({ type: 'jsonb', nullable: true })
    afterData: Record<string, any>;

    @Column({ type: 'inet', nullable: true })
    ipAddress: string;

    @Column({ type: 'text', nullable: true })
    userAgent: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    requestId: string;

    @CreateDateColumn()
    createdAt: Date;

    // Immutable constraint - no updates allowed
}
