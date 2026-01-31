import { Entity, PrimaryGeneratedColumn, Column, ViewEntity, Connection } from 'typeorm';

@ViewEntity({
    name: 'vw_current_stock',
    synchronize: false,
    materialized: false,
})
export class StockLevel {
    @Column({ type: 'uuid' })
    branchId: string;

    @Column({ type: 'uuid' })
    productId: string;

    @Column({ type: 'varchar' })
    productName: string;

    @Column({ type: 'uuid', nullable: true })
    batchId: string;

    @Column({ type: 'varchar', nullable: true })
    batchNo: string;

    @Column({ type: 'date', nullable: true })
    expiryDate: Date;

    @Column({ type: 'uuid', nullable: true })
    binId: string;

    @Column({ type: 'varchar', nullable: true })
    binCode: string;

    @Column({ type: 'numeric', precision: 14, scale: 3 })
    qtyOnHand: number;

    @Column({ type: 'numeric', precision: 14, scale: 4, nullable: true })
    lastUnitCost: number;

    @Column({ type: 'timestamp', nullable: true })
    lastMovementDate: Date;
}
