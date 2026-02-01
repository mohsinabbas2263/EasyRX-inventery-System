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
import { SalesQueryDto } from './dto/sales-query.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

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
    create(@Body() dto: CreateSaleDto, @NestRequest() req: RequestWithUser) {
        return this.salesService.createSale(dto, req.user as any);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sales for the company' })
    findAll(@Query() query: SalesQueryDto, @NestRequest() req: RequestWithUser) {
        return this.salesService.findAll(query, req.user as any);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific sale' })
    findOne(@Param('id') id: string, @NestRequest() req: RequestWithUser) {
        return this.salesService.findOne(id, req.user as any);
    }
}
