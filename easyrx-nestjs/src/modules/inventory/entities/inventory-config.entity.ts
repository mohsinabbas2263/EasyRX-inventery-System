import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('inventory_config')
@Index('idx_config_branch_product', ['branchId', 'productId'], { unique: true })
export class InventoryConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'numeric', precision: 14, scale: 3, default: 0 })
  minQty: number;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  maxQty: number;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  reorderPoint: number;

  @Column({ type: 'numeric', precision: 14, scale: 3, nullable: true })
  safetyStock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
