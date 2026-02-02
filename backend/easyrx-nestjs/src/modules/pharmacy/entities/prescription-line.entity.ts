import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { Product } from '../../products/entities/product.entity';

const numericTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) => (value === null ? null : parseFloat(value)),
};

@Entity('prescription_lines')
export class PrescriptionLine {
  @PrimaryGeneratedColumn('uuid', { name: 'line_id' })
  lineId!: string;

  @Column({ name: 'prescription_id', type: 'uuid' })
  @Index()
  prescriptionId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  quantity!: number;

  @Column({ length: 255, nullable: true })
  dosage?: string;

  @Column({ length: 100, nullable: true })
  frequency?: string;

  @Column({ name: 'duration_days', type: 'int', nullable: true })
  durationDays?: number;

  @ManyToOne(() => Prescription)
  @JoinColumn({ name: 'prescription_id' })
  prescription!: Prescription;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
