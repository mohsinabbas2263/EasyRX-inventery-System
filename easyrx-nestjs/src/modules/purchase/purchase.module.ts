import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderLine } from './entities/purchase-order-line.entity';
import { GoodsReceiptNote } from './entities/goods-receipt-note.entity';
import { GRNLine } from './entities/grn-line.entity';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      PurchaseOrder,
      PurchaseOrderLine,
      GoodsReceiptNote,
      GRNLine,
    ]),
  ],
  providers: [PurchaseService],
  controllers: [PurchaseController],
  exports: [PurchaseService, TypeOrmModule],
})
export class PurchaseModule {}
