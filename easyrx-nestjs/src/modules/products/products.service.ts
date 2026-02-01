import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        companyId: string,
        userId: string,
    ): Promise<Product> {
        // Check for duplicate barcode
        if (createProductDto.barcode1d) {
            const existing = await this.productRepository.findOne({
                where: {
                    companyId,
                    barcode1d: createProductDto.barcode1d,
                },
            });

            if (existing) {
                throw new ConflictException(
                    `Product with barcode ${createProductDto.barcode1d} already exists`,
                );
            }
        }

        const product = this.productRepository.create({
            ...createProductDto,
            companyId,
            createdBy: userId,
            updatedBy: userId,
        });

        return this.productRepository.save(product);
    }

    async findAll(
        companyId: string,
        query: ProductQueryDto,
    ): Promise<Product[]> {
        const where: FindOptionsWhere<Product> = { companyId };

        if (query.search) {
            where.brandName = Like(`%${query.search}%`);
        }

        if (query.barcode) {
            where.barcode1d = query.barcode;
        }

        if (query.isControlledDrug !== undefined) {
            where.isControlledDrug = query.isControlledDrug;
        }

        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }

        return this.productRepository.find({ where, order: { brandName: 'ASC' } });
    }

    async findOne(productId: string, companyId: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { productId, companyId },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        return product;
    }

    async findByBarcode(
        barcode: string,
        companyId: string,
    ): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { barcode1d: barcode, companyId },
        });
    }

    async update(
        productId: string,
        companyId: string,
        updateProductDto: UpdateProductDto,
        userId: string,
    ): Promise<Product> {
        const product = await this.findOne(productId, companyId);

        // Check barcode uniqueness if being changed
        if (
            updateProductDto.barcode1d &&
            updateProductDto.barcode1d !== product.barcode1d
        ) {
            const existing = await this.productRepository.findOne({
                where: {
                    companyId,
                    barcode1d: updateProductDto.barcode1d,
                },
            });

            if (existing) {
                throw new ConflictException(
                    `Product with barcode ${updateProductDto.barcode1d} already exists`,
                );
            }
        }

        Object.assign(product, updateProductDto);
        product.updatedBy = userId;

        return this.productRepository.save(product);
    }

    async remove(productId: string, companyId: string): Promise<void> {
        const product = await this.findOne(productId, companyId);

        // Soft delete by setting isActive = false
        product.isActive = false;
        await this.productRepository.save(product);
    }
}
