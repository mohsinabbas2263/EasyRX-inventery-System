import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { CreateSupplierDto } from './dto/supplier.dto';
import { CreatePurchaseOrderDto } from './dto/purchase-order.dto';
import { TenantContextService } from '../../common/services/tenant-context.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(PurchaseOrder)
    private readonly poRepository: Repository<PurchaseOrder>,
    private readonly poLineRepository: Repository<PurchaseOrderLine>,
    private readonly tenantContext: TenantContextService,
    private readonly dataSource: DataSource,
  ) { }

  // --- Suppliers ---
  async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
    const userId = this.tenantContext.userId;
    const companyId = this.tenantContext.companyId;

    if (!userId || !companyId) {
      throw new Error('User or Company context not found');
    }

    const supplier = this.supplierRepository.create({
      ...dto,
      companyId: companyId,
      createdBy: userId,
    });
    return await this.supplierRepository.save(supplier);
  }

  async findAllSuppliers(): Promise<Supplier[]> {
    return await this.supplierRepository.find({
      where: { companyId: this.tenantContext.companyId }
    });
  }

  // --- Purchase Orders ---
  async createPurchaseOrder(
    dto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const userId = this.tenantContext.userId;
    const companyId = this.tenantContext.companyId;
    const branchId = this.tenantContext.branchId;

    if (!userId || !companyId || !branchId) {
      throw new Error('User, Company, or Branch context not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const po = this.poRepository.create({
        ...dto,
        companyId: companyId,
        branchId: branchId,
        orderDate: new Date(dto.orderDate),
        expectedDeliveryDate: dto.expectedDeliveryDate
          ? new Date(dto.expectedDeliveryDate)
          : undefined,
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

  async findAllPurchaseOrders(): Promise<PurchaseOrder[]> {
    return await this.poRepository.find({
      where: { branchId: this.tenantContext.branchId },
      relations: ['supplier'],
    });
  }
}
