import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CacheModule } from '@nestjs/cache-manager';
import { StockController } from './controllers/stock.controller';
import { MovementController } from './controllers/movement.controller';
import { ConfigController } from './controllers/config.controller';
import { StockService } from './services/stock.service';
import { MovementService } from './services/movement.service';
import { InventoryConfigService } from './services/inventory-config.service';
import { InventoryLedger } from './entities/inventory-ledger.entity';
import { StockLevel } from './entities/stock-level.entity';
import { BinLocation } from './entities/bin-location.entity';
import { InventoryConfig } from './entities/inventory-config.entity';
import { Product } from '../products/entities/product.entity';
import { ProductBatch } from '../products/entities/product-batch.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InventoryLedger,
            StockLevel,
            BinLocation,
            InventoryConfig,
            Product,
            ProductBatch,
        ]),
        // CacheModule.register({
        //     ttl: 5 * 60 * 1000, // 5 minutes
        //     max: 500,
        // }),
    ],
    controllers: [StockController, MovementController, ConfigController],
    providers: [StockService, MovementService, InventoryConfigService],
    exports: [StockService, MovementService, InventoryConfigService],
})
export class InventoryModule { }
