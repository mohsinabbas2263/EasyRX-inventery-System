import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SalesInvoice } from '../../sales/entities/sales-invoice.entity';
import { Customer } from './customer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('controlled_dispense_log')
@Index(['companyId', 'dispensedAt'])
export class ControlledDispenseLog {
  @PrimaryGeneratedColumn('uuid', { name: 'log_id' })
  logId!: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId!: string;

  @Column({ name: 'branch_id', type: 'uuid' })
  branchId!: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  @Index()
  saleId!: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ name: 'dispensed_at', type: 'timestamp' })
  dispensedAt!: Date;

  @Column({ name: 'pharmacist_id', type: 'uuid' })
  pharmacistId!: string; // The user who authorized the dispense

  @Column({ name: 'patient_cnic', length: 20, nullable: true })
  patientCnic?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => SalesInvoice)
  @JoinColumn({ name: 'sale_id' })
  sale!: SalesInvoice;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
