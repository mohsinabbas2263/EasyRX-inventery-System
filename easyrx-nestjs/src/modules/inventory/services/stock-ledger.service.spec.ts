import { Test, TestingModule } from '@nestjs/testing';
import { StockLedgerService } from './stock-ledger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { ProductBatch } from '../../products/entities/product-batch.entity';
import { DataSource } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('StockLedgerService', () => {
    let service: StockLedgerService;
    let mockQueryRunner: any;

    const mockLedgerRepository = {
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockDataSource = {
        createQueryRunner: jest.fn(),
    };

    beforeEach(async () => {
        mockQueryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
            manager: {
                findOne: jest.fn(),
                update: jest.fn(),
                create: jest.fn(),
                save: jest.fn(),
            },
        };

        mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StockLedgerService,
                {
                    provide: getRepositoryToken(InventoryLedger),
                    useValue: mockLedgerRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<StockLedgerService>(StockLedgerService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('postMovement', () => {
        it('should post stock-in movement successfully', async () => {
            const movement = {
                productId: 'prod-1',
                batchId: 'batch-1',
                branchId: 'branch-1',
                documentType: 'GRN',
                documentId: 'grn-1',
                qtyIn: 100,
                unitCost: 10,
                postedBy: 'user-1',
            };

            const mockBatch = {
                batchId: 'batch-1',
                quantityOnHand: 50,
            };

            mockQueryRunner.manager.findOne.mockResolvedValue(mockBatch);
            mockQueryRunner.manager.update.mockResolvedValue({});
            mockQueryRunner.manager.create.mockReturnValue({ ...movement });
            mockQueryRunner.manager.save.mockResolvedValue({ ...movement });

            const result = await service.postMovement(movement);

            expect(mockQueryRunner.connect).toHaveBeenCalled();
            expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(
                ProductBatch,
                expect.objectContaining({
                    where: { batchId: 'batch-1' },
                    lock: { mode: 'pessimistic_write' },
                }),
            );
            expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
                ProductBatch,
                { batchId: 'batch-1' },
                { quantityOnHand: 150 }, // 50 + 100
            );
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.release).toHaveBeenCalled();
        });

        it('should reject negative stock', async () => {
            const movement = {
                productId: 'prod-1',
                batchId: 'batch-1',
                branchId: 'branch-1',
                documentType: 'SALE',
                documentId: 'sale-1',
                qtyOut: 100,
                postedBy: 'user-1',
            };

            const mockBatch = {
                batchId: 'batch-1',
                quantityOnHand: 50, // Only 50 available
            };

            mockQueryRunner.manager.findOne.mockResolvedValue(mockBatch);

            await expect(service.postMovement(movement)).rejects.toThrow(
                BadRequestException,
            );
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        });

        it('should reject movements with both qtyIn and qtyOut', async () => {
            const movement = {
                productId: 'prod-1',
                batchId: 'batch-1',
                branchId: 'branch-1',
                documentType: 'INVALID',
                documentId: 'invalid-1',
                qtyIn: 50,
                qtyOut: 50,
                postedBy: 'user-1',
            };

            const mockBatch = { batchId: 'batch-1', quantityOnHand: 100 };
            mockQueryRunner.manager.findOne.mockResolvedValue(mockBatch);

            await expect(service.postMovement(movement)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('postMultipleMovements', () => {
        it('should post multiple movements atomically', async () => {
            const movements = [
                {
                    productId: 'prod-1',
                    batchId: 'batch-1',
                    branchId: 'branch-1',
                    documentType: 'SALE',
                    documentId: 'sale-1',
                    qtyOut: 10,
                    postedBy: 'user-1',
                },
                {
                    productId: 'prod-2',
                    batchId: 'batch-2',
                    branchId: 'branch-1',
                    documentType: 'SALE',
                    documentId: 'sale-1',
                    qtyOut: 5,
                    postedBy: 'user-1',
                },
            ];

            mockQueryRunner.manager.findOne
                .mockResolvedValueOnce({ batchId: 'batch-1', quantityOnHand: 100 })
                .mockResolvedValueOnce({ batchId: 'batch-2', quantityOnHand: 50 });
            mockQueryRunner.manager.save.mockResolvedValue({});

            const result = await service.postMultipleMovements(movements);

            expect(result).toHaveLength(2);
            expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
        });

        it('should rollback all if one fails', async () => {
            const movements = [
                {
                    productId: 'prod-1',
                    batchId: 'batch-1',
                    branchId: 'branch-1',
                    documentType: 'SALE',
                    documentId: 'sale-1',
                    qtyOut: 10,
                    postedBy: 'user-1',
                },
                {
                    productId: 'prod-2',
                    batchId: 'batch-2',
                    branchId: 'branch-1',
                    documentType: 'SALE',
                    documentId: 'sale-1',
                    qtyOut: 1000, // Too much!
                    postedBy: 'user-1',
                },
            ];

            mockQueryRunner.manager.findOne
                .mockResolvedValueOnce({ batchId: 'batch-1', quantityOnHand: 100 })
                .mockResolvedValueOnce({ batchId: 'batch-2', quantityOnHand: 50 });

            await expect(service.postMultipleMovements(movements)).rejects.toThrow();
            expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
        });
    });
});
