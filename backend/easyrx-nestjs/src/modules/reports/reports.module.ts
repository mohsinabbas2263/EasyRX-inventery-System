import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CacheModule } from '@nestjs/cache-manager';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { SalesInvoice } from '../sales/entities/sales-invoice.entity';
import { SalesInvoiceLine } from '../sales/entities/sales-invoice-line.entity';
import { InventoryLedger } from '../inventory/entities/inventory-ledger.entity';
import { Product } from '../products/entities/product.entity';
import { ProductBatch } from '../products/entities/product-batch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesInvoice,
      SalesInvoiceLine,
      InventoryLedger,
      Product,
      ProductBatch,
    ]),
    // CacheModule.register({
    //     ttl: 5 * 60 * 1000, // 5 minutes
    //     max: 100,
    // }),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
