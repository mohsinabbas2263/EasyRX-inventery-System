import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum BinType {
  SHELF = 'SHELF',
  FRIDGE = 'FRIDGE',
  FREEZER = 'FREEZER',
  QUARANTINE = 'QUARANTINE',
}

@Entity('bin_locations')
@Index('idx_bin_branch_code', ['branchId', 'code'], { unique: true })
export class BinLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: BinType.SHELF })
  binType: BinType;

  @Column({ type: 'boolean', default: false })
  isColdChain: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
