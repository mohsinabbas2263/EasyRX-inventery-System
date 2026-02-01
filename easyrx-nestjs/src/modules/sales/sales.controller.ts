import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request as NestRequest,
    Get,
    Param,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';

@ApiTags('sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new sale' })
    @ApiResponse({ status: 201, description: 'Sale created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request - Validation or Stock error' })
    create(@Body() dto: CreateSaleDto, @NestRequest() req: any) {
        return this.salesService.createSale(dto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sales for the company' })
    findAll(@Query() query: any, @NestRequest() req: any) {
        return this.salesService.findAll(query, req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific sale' })
    findOne(@Param('id') id: string, @NestRequest() req: any) {
        return this.salesService.findOne(id, req.user);
    }
}
