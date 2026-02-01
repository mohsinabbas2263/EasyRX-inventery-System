import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryConfig } from '../entities/inventory-config.entity';
import { InventoryConfigDto, QueryInventoryConfigDto } from '../dto/inventory-config.dto';

@Injectable()
export class InventoryConfigService {
    constructor(
        @InjectRepository(InventoryConfig)
        private configRepository: Repository<InventoryConfig>,
    ) { }

    async create(dto: InventoryConfigDto): Promise<InventoryConfig> {
        const existing = await this.configRepository.findOne({
            where: { branchId: dto.branchId, productId: dto.productId },
        });

        if (existing) {
            existing.minQty = dto.minQty || 0;
            existing.maxQty = dto.maxQty || 0;
            existing.reorderPoint = dto.reorderPoint || 0;
            existing.safetyStock = dto.safetyStock || 0;
            return this.configRepository.save(existing);
        }

        const config = this.configRepository.create(dto);
        return this.configRepository.save(config);
    }

    async findAll(query: QueryInventoryConfigDto): Promise<{ data: InventoryConfig[]; total: number }> {
        const qb = this.configRepository.createQueryBuilder();

        if (query.branchId) {
            qb.andWhere('branchId = :branchId', { branchId: query.branchId });
        }

        if (query.productId) {
            qb.andWhere('productId = :productId', { productId: query.productId });
        }

        const [data, total] = await qb
            .take(query.limit)
            .skip(query.offset)
            .getManyAndCount();

        return { data, total };
    }

    async findOne(id: string): Promise<InventoryConfig> {
        const config = await this.configRepository.findOne({ where: { id } });
        if (!config) throw new NotFoundException(`Config ${id} not found`);
        return config;
    }

    async update(id: string, dto: Partial<InventoryConfigDto>): Promise<InventoryConfig> {
        await this.configRepository.update(id, dto);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        await this.configRepository.delete(id);
    }
}
