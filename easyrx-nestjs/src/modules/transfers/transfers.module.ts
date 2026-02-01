import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferLine } from './entities/stock-transfer-line.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockTransfer, StockTransferLine])],
    exports: [TypeOrmModule],
})
export class TransfersModule { }
