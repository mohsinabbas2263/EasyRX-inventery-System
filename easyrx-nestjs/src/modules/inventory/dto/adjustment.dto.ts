import { IsUUID, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
import { AdjustmentReason } from '../entities/inventory-ledger.entity';

export class CycleCountDto {
  @IsUUID()
  branchId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  binId: string;

  @IsUUID()
  @IsOptional()
  batchId?: string;

  @IsNumber()
  @Min(0)
  countedQty: number;
}

export class AdjustmentDto {
  @IsUUID()
  branchId: string;

  @IsUUID()
  productId: string;

  @IsUUID()
  @IsOptional()
  batchId?: string;

  @IsUUID()
  binId: string;

  @IsNumber()
  @Min(0)
  qty: number;

  @IsEnum(AdjustmentReason)
  reason: AdjustmentReason;
}
