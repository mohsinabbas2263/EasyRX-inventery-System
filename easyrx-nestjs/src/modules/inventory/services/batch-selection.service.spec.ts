import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchSelectionService, InsufficientStockException } from './batch-selection.service';
import { ProductBatch } from '../../products/entities/product-batch.entity';

describe('BatchSelectionService', () => {
    let service!: BatchSelectionService;
    let repository!: Repository<ProductBatch>;

    const mockRepository = {
        find: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BatchSelectionService,
                {
                    provide: getRepositoryToken(ProductBatch),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<BatchSelectionService>(BatchSelectionService);
        repository = module.get<Repository<ProductBatch>>(
            getRepositoryToken(ProductBatch),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('selectBatchesForSale', () => {
        it('should select nearest expiry batch first (FEFO)', async () => {
            const batches = [
                {
                    batchId: 'B2',
                    batchNo: 'B002',
                    expiryDate: new Date('2026-02-01'),
                    quantityOnHand: 50,
                    costPrice: 5.0,
                },
                {
                    batchId: 'B1',
                    batchNo: 'B001',
                    expiryDate: new Date('2026-03-01'),
                    quantityOnHand: 100,
                    costPrice: 5.0,
                },
                {
                    batchId: 'B3',
                    batchNo: 'B003',
                    expiryDate: new Date('2026-04-01'),
                    quantityOnHand: 200,
                    costPrice: 5.0,
                },
            ];

            mockRepository.find.mockResolvedValue(batches);

            const result = await service.selectBatchesForSale('P1', 'BR1', 30);

            expect(result).toHaveLength(1);
            expect(result[0].batchId).toBe('B2'); // Nearest expiry
            expect(result[0].quantity).toBe(30);
        });

        it('should allocate across multiple batches when needed', async () => {
            const batches = [
                {
                    batchId: 'B1',
                    batchNo: 'B001',
                    expiryDate: new Date('2026-02-01'),
                    quantityOnHand: 20,
                    costPrice: 5.0,
                },
                {
                    batchId: 'B2',
                    batchNo: 'B002',
                    expiryDate: new Date('2026-03-01'),
                    quantityOnHand: 30,
                    costPrice: 5.0,
                },
            ];

            mockRepository.find.mockResolvedValue(batches);

            const result = await service.selectBatchesForSale('P1', 'BR1', 40);

            expect(result).toHaveLength(2);
            expect(result[0].batchId).toBe('B1');
            expect(result[0].quantity).toBe(20);
            expect(result[1].batchId).toBe('B2');
            expect(result[1].quantity).toBe(20);
        });

        it('should throw InsufficientStockException when quantity exceeds available', async () => {
            const batches = [
                {
                    batchId: 'B1',
                    batchNo: 'B001',
                    expiryDate: new Date('2026-02-01'),
                    quantityOnHand: 10,
                    costPrice: 5.0,
                },
            ];

            mockRepository.find.mockResolvedValue(batches);

            await expect(
                service.selectBatchesForSale('P1', 'BR1', 100),
            ).rejects.toThrow(InsufficientStockException);
        });

        it('should throw InsufficientStockException when no batches available', async () => {
            mockRepository.find.mockResolvedValue([]);

            await expect(
                service.selectBatchesForSale('P1', 'BR1', 10),
            ).rejects.toThrow(InsufficientStockException);
        });
    });
});
