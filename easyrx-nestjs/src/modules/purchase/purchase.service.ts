import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { CreateSupplierDto } from './dto/supplier.dto';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepository: Repository<Supplier>,
        @InjectRepository(PurchaseOrder)
        private readonly poRepository: Repository<PurchaseOrder>,
        @InjectRepository(PurchaseOrderLine)
        private readonly poLineRepository: Repository<PurchaseOrderLine>,
        private readonly dataSource: DataSource,
    ) { }

    // --- Suppliers ---
    async createSupplier(dto: CreateSupplierDto, userId: string): Promise<Supplier> {
        const supplier = this.supplierRepository.create({
            ...dto,
            createdBy: userId,
        });
        return await this.supplierRepository.save(supplier);
    }

    async findAllSuppliers(companyId: string): Promise<Supplier[]> {
        return await this.supplierRepository.find({ where: { companyId } });
    }

    // --- Purchase Orders ---
    async createPurchaseOrder(dto: CreatePurchaseOrderDto, userId: string): Promise<PurchaseOrder> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const po = this.poRepository.create({
                ...dto,
                orderDate: new Date(dto.orderDate),
                expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
                poNumber: `PO-${Date.now()}`, // Placeholder number logic
                createdBy: userId,
                totalAmount: 0,
            });

            const savedPo = await queryRunner.manager.save(po);
            let total = 0;

            for (const lineDto of dto.lines) {
                const line = this.poLineRepository.create({
                    ...lineDto,
                    poId: savedPo.poId,
                    netTotal: lineDto.quantity * lineDto.unitCost,
                });
                await queryRunner.manager.save(line);
                total += line.netTotal;
            }

            savedPo.totalAmount = total;
            await queryRunner.manager.save(savedPo);

            await queryRunner.commitTransaction();
            return savedPo;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllPurchaseOrders(branchId: string): Promise<PurchaseOrder[]> {
        return await this.poRepository.find({
            where: { branchId },
            relations: ['supplier'],
        });
    }
}
