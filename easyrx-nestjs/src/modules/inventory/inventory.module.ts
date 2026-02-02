import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryLedger } from './entities/inventory-ledger.entity';
import { ProductBatch } from '../products/entities/product-batch.entity';
import { Product } from '../products/entities/product.entity';
import { InventoryConfig } from './entities/inventory-config.entity';
import { BatchSelectionService } from './services/batch-selection.service';
import { StockLedgerService } from './services/stock-ledger.service';
import { StockService } from './services/stock.service';
import { MovementService } from './services/movement.service';
import { InventoryConfigService } from './services/inventory-config.service';
import { StockController } from './controllers/stock.controller';
import { MovementController } from './controllers/movement.controller';
import { ConfigController } from './controllers/config.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryLedger,
      ProductBatch,
      Product,
      InventoryConfig,
    ]),
  ],
  providers: [
    BatchSelectionService,
    StockLedgerService,
    StockService,
    MovementService,
    InventoryConfigService,
  ],
  controllers: [StockController, MovementController, ConfigController],
  exports: [
    BatchSelectionService,
    StockLedgerService,
    StockService,
    MovementService,
  ],
})
export class InventoryModule { }
