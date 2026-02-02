import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('chart_of_accounts')
@Index(['companyId', 'code'], { unique: true })
export class ChartOfAccount {
  @PrimaryGeneratedColumn('uuid', { name: 'account_id' })
  accountId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ length: 20 })
  code!: string; // e.g., '1000', '2000'

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 50 })
  type!: string; // 'ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
