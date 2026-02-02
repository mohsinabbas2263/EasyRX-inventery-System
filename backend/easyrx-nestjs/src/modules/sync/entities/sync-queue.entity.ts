import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('sync_queue')
@Index(['branchId', 'status', 'priority'])
export class SyncQueue {
  @PrimaryGeneratedColumn('uuid', { name: 'sync_id' })
  syncId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'document_type', length: 50 })
  documentType!: string;

  @Column({ name: 'local_uuid', type: 'uuid', unique: true })
  localUuid!: string;

  @Column({ name: 'payload', type: 'jsonb' })
  payload!: any;

  @Column({ length: 20, default: 'PENDING' })
  status!: string;

  @Column({ default: 0 })
  priority!: number;

  @Column({ name: 'retry_count', default: 0 })
  retryCount!: number;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError?: string;

  @Column({
    name: 'idempotency_key',
    length: 100,
    unique: true,
    nullable: true,
  })
  idempotencyKey?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
