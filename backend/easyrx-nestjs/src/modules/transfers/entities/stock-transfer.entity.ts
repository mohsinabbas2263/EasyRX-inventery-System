import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { StockTransferLine } from './stock-transfer-line.entity';

@Entity('stock_transfers')
@Index(['companyId', 'fromBranchId'])
@Index(['companyId', 'toBranchId'])
export class StockTransfer {
  @PrimaryGeneratedColumn('uuid', { name: 'transfer_id' })
  transferId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  @Index()
  companyId!: string;

  @Column({ name: 'from_branch_id', type: 'uuid' })
  @Index()
  fromBranchId!: string;

  @Column({ name: 'to_branch_id', type: 'uuid' })
  @Index()
  toBranchId!: string;

  @Column({ name: 'transfer_number', length: 50, unique: true })
  transferNumber!: string;

  @Column({ name: 'transfer_date', type: 'date' })
  transferDate!: Date;

  @Column({ length: 30, default: 'PENDING' })
  status!: string; // 'PENDING', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED'

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => StockTransferLine, (line) => line.transfer)
  lines!: StockTransferLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  @Index()
  createdBy!: string;

  @Column({ name: 'received_by', type: 'uuid', nullable: true })
  receivedBy?: string;

  @Column({ name: 'received_at', type: 'timestamp', nullable: true })
  receivedAt?: Date;
}
