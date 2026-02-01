import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  Between,
  Like,
  FindOptionsWhere,
} from 'typeorm';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { SalesInvoiceLine } from './entities/sales-invoice-line.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SalesQueryDto } from './dto/sales-query.dto';
import { BatchSelectionService } from '../inventory/services/batch-selection.service';
import { StockLedgerService } from '../inventory/services/stock-ledger.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(SalesInvoice)
    private readonly invoiceRepository: Repository<SalesInvoice>,
    @InjectRepository(SalesInvoiceLine)
    private readonly lineRepository: Repository<SalesInvoiceLine>,
    private readonly batchSelectionService: BatchSelectionService,
    private readonly stockLedgerService: StockLedgerService,
    private readonly dataSource: DataSource,
  ) {}

  async createSale(dto: CreateSaleDto, user: User): Promise<SalesInvoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the Invoice header
      const invoice = this.invoiceRepository.create({
        companyId: user.companyId,
        branchId: dto.branchId,
        customerId: dto.customerId,
        saleDate: new Date(),
        saleNumber: `SALE-${Date.now()}`, // Placeholder logic
        paymentMethod: dto.paymentMethod,
        status: 'POSTED',
        discountTotal: dto.discountTotal || 0,
        grossTotal: 0,
        taxTotal: 0,
        netTotal: 0,
        createdBy: user.userId,
        localUuid: dto.localUuid,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);
      let runningGrossTotal = 0;

      // 2. Process each line
      for (const lineDto of dto.lines) {
        // a. Select batches (FEFO)
        const allocations =
          await this.batchSelectionService.selectBatchesForSale(
            lineDto.productId,
            dto.branchId,
            lineDto.quantity,
          );

        for (const allocation of allocations) {
          // b. Deduct stock and post movement
          await this.stockLedgerService.postMovementWithManager(
            queryRunner.manager,
            {
              branchId: dto.branchId,
              productId: lineDto.productId,
              batchId: allocation.batchId,
              documentType: 'SALE',
              documentId: savedInvoice.saleId,
              qtyOut: allocation.quantity,
              qtyIn: 0,
              unitCost: 0, // Should come from batch
              postedBy: user.userId,
            },
          );

          // c. Create Invoice Line
          const line = this.lineRepository.create({
            saleId: savedInvoice.saleId,
            productId: lineDto.productId,
            batchId: allocation.batchId,
            quantity: allocation.quantity,
            unitPrice: lineDto.unitPrice || 0, // Simplified price logic
            discountAmount: 0,
            taxAmount: 0,
            netTotal: (lineDto.unitPrice || 0) * allocation.quantity,
          });

          await queryRunner.manager.save(line);
          runningGrossTotal += line.netTotal;
        }
      }

      // 3. Update totals
      savedInvoice.grossTotal = runningGrossTotal;
      savedInvoice.netTotal = runningGrossTotal - savedInvoice.discountTotal;
      await queryRunner.manager.save(savedInvoice);

      await queryRunner.commitTransaction();
      return savedInvoice;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: SalesQueryDto, user: User) {
    const where: FindOptionsWhere<SalesInvoice> = { companyId: user.companyId };

    if (query.branchId) {
      where.branchId = query.branchId;
    }
    if (query.customerId) {
      where.customerId = query.customerId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.fromDate || query.toDate) {
      where.saleDate = Between(
        query.fromDate ? new Date(query.fromDate) : new Date(0),
        query.toDate ? new Date(query.toDate) : new Date(),
      );
    }
    if (query.search) {
      where.saleNumber = Like(`%${query.search}%`);
    }

    return this.invoiceRepository.find({
      where,
      order: { saleDate: 'DESC' },
    });
  }

  async findOne(id: string, user: User) {
    return this.invoiceRepository.findOne({
      where: { saleId: id, companyId: user.companyId },
    });
  }
}
