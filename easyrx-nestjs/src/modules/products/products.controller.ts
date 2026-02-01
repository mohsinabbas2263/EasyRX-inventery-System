import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create new product' })
    @ApiResponse({ status: 201, description: 'Product created successfully' })
    @ApiResponse({ status: 409, description: 'Product with barcode already exists' })
    create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
        return this.productsService.create(
            createProductDto,
            req.user.companyId,
            req.user.userId,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    findAll(@Query() query: ProductQueryDto, @Request() req: any) {
        return this.productsService.findAll(req.user.companyId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    findOne(@Param('id') id: string, @Request() req: any) {
        return this.productsService.findOne(id, req.user.companyId);
    }

    @Get('barcode/:barcode')
    @ApiOperation({ summary: 'Find product by barcode' })
    @ApiResponse({ status: 200, description: 'Product found' })
    findByBarcode(@Param('barcode') barcode: string, @Request() req: any) {
        return this.productsService.findByBarcode(barcode, req.user.companyId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({ status: 200, description: 'Product updated successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @Request() req: any,
    ) {
        return this.productsService.update(
            id,
            req.user.companyId,
            updateProductDto,
            req.user.userId,
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete product (soft delete)' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    remove(@Param('id') id: string, @Request() req: any) {
        return this.productsService.remove(id, req.user.companyId);
    }
}
