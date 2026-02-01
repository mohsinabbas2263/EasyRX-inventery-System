import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferLine } from './entities/stock-transfer-line.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { StockLedgerService } from '../inventory/services/stock-ledger.service';
import { BatchSelectionService } from '../inventory/services/batch-selection.service';
import { TenantContextService } from '../../common/services/tenant-context.service';

export enum TransferStatus {
    PENDING = 'PENDING',
    IN_TRANSIT = 'IN_TRANSIT',
    RECEIVED = 'RECEIVED',
    CANCELLED = 'CANCELLED',
}

@Injectable()
export class TransfersService {
    constructor(
        @InjectRepository(StockTransfer)
        private readonly transferRepository: Repository<StockTransfer>,
        @InjectRepository(StockTransferLine)
        private readonly lineRepository: Repository<StockTransferLine>,
        private readonly stockLedgerService: StockLedgerService,
        private readonly batchSelectionService: BatchSelectionService,
        private readonly tenantContext: TenantContextService,
        private readonly dataSource: DataSource,
    ) { }

    async requestTransfer(dto: CreateTransferDto): Promise<StockTransfer> {
        const transfer = this.transferRepository.create({
            companyId: this.tenantContext.companyId,
            fromBranchId: dto.sourceBranchId,
            toBranchId: this.tenantContext.branchId,
            transferNumber: `TRF-${Date.now()}`, // Simple generation for POC
            transferDate: new Date(),
            status: TransferStatus.PENDING,
            createdBy: this.tenantContext.userId,
        });

        const savedTransfer = await this.transferRepository.save(transfer);

        const lines = dto.lines.map((line) =>
            this.lineRepository.create({
                transferId: savedTransfer.transferId,
                productId: line.productId,
                qtyRequested: line.quantity,
            }),
        );

        await this.lineRepository.save(lines);
        return savedTransfer;
    }

    async dispatchTransfer(id: string): Promise<StockTransfer> {
        const transfer = await this.transferRepository.findOne({
            where: { transferId: id, companyId: this.tenantContext.companyId },
            relations: ['lines'],
        });

        if (!transfer) throw new NotFoundException('Transfer not found');
        if (transfer.status !== TransferStatus.PENDING) {
            throw new BadRequestException('Transfer is not in PENDING status');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const line of transfer.lines) {
                const allocations = await this.batchSelectionService.selectBatchesForSale(
                    line.productId,
                    transfer.fromBranchId,
                    line.qtyRequested,
                );

                for (const allocation of allocations) {
                    await this.stockLedgerService.postMovementWithManager(queryRunner.manager, {
                        branchId: transfer.fromBranchId,
                        productId: line.productId,
                        batchId: allocation.batchId,
                        documentType: 'TRANSFER_OUT',
                        documentId: transfer.transferId,
                        qtyOut: allocation.quantity,
                        qtyIn: 0,
                        unitCost: allocation.costPrice,
                        postedBy: this.tenantContext.userId!,
                    });

                    line.qtyDispatched = (line.qtyDispatched || 0) + allocation.quantity;
                    line.batchId = allocation.batchId;
                }
                await queryRunner.manager.save(line);
            }

            transfer.status = TransferStatus.IN_TRANSIT;
            await queryRunner.manager.save(transfer);

            await queryRunner.commitTransaction();
            return transfer;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async receiveTransfer(id: string): Promise<StockTransfer> {
        const transfer = await this.transferRepository.findOne({
            where: { transferId: id, companyId: this.tenantContext.companyId },
            relations: ['lines'],
        });

        if (!transfer) throw new NotFoundException('Transfer not found');
        if (transfer.status !== TransferStatus.IN_TRANSIT) {
            throw new BadRequestException('Transfer is not in IN_TRANSIT status');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const line of transfer.lines) {
                if (!line.batchId) continue; // Should not happen in DISPATCHED status

                await this.stockLedgerService.postMovementWithManager(queryRunner.manager, {
                    branchId: transfer.toBranchId,
                    productId: line.productId,
                    batchId: line.batchId,
                    documentType: 'TRANSFER_IN',
                    documentId: transfer.transferId,
                    qtyIn: line.qtyDispatched || 0,
                    qtyOut: 0,
                    unitCost: 0,
                    postedBy: this.tenantContext.userId!,
                });

                line.qtyReceived = line.qtyDispatched;
                await queryRunner.manager.save(line);
            }

            transfer.status = TransferStatus.RECEIVED;
            transfer.receivedBy = this.tenantContext.userId;
            transfer.receivedAt = new Date();
            await queryRunner.manager.save(transfer);

            await queryRunner.commitTransaction();
            return transfer;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<StockTransfer[]> {
        return this.transferRepository.find({
            where: [
                { fromBranchId: this.tenantContext.branchId, companyId: this.tenantContext.companyId },
                { toBranchId: this.tenantContext.branchId, companyId: this.tenantContext.companyId },
            ],
            order: { transferDate: 'DESC' },
        });
    }
}
