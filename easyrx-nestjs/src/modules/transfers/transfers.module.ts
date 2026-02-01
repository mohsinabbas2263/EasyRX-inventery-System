import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferLine } from './entities/stock-transfer-line.entity';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransfer, StockTransferLine]),
    forwardRef(() => InventoryModule),
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
  exports: [TransfersService, TypeOrmModule],
})
export class TransfersModule { }
