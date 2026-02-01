import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLedger } from './entities/inventory-ledger.entity';
import { ProductBatch } from '../products/entities/product-batch.entity';
import { BatchSelectionService } from './services/batch-selection.service';
import { StockLedgerService } from './services/stock-ledger.service';

@Module({
    imports: [TypeOrmModule.forFeature([InventoryLedger, ProductBatch])],
    providers: [BatchSelectionService, StockLedgerService],
    exports: [BatchSelectionService, StockLedgerService],
})
export class InventoryModule { }
