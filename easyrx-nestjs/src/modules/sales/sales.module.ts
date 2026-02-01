import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesInvoice } from './entities/sales-invoice.entity';
import { SalesInvoiceLine } from './entities/sales-invoice-line.entity';
import { SalesReturn } from './entities/sales-return.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SalesInvoice, SalesInvoiceLine, SalesReturn]),
        InventoryModule,
        ProductsModule,
    ],
    providers: [SalesService],
    controllers: [SalesController],
    exports: [SalesService],
})
export class SalesModule { }
