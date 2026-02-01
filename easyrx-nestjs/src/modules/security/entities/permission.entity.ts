import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid', { name: 'permission_id' })
  permissionId!: string;

  @Column({ length: 100, unique: true })
  @Index()
  code!: string; // e.g., 'SALES_CREATE', 'PRODUCTS_UPDATE'

  @Column({ length: 255 })
  description!: string;

  @Column({ length: 50 })
  module!: string; // e.g., 'SALES', 'INVENTORY'

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
