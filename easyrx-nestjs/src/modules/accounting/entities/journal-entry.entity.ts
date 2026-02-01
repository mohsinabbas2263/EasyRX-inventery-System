import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('journal_entries')
@Index(['companyId', 'entryDate'])
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid', { name: 'entry_id' })
  entryId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'entry_date', type: 'date' })
  entryDate!: Date;

  @Column({ length: 255 })
  description!: string;

  @Column({ name: 'document_type', length: 50, nullable: true })
  documentType?: string; // 'SALE', 'PURCHASE', 'PAYMENT', etc.

  @Column({ name: 'document_id', type: 'uuid', nullable: true })
  documentId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;
}
