import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class InventoryConfigDto {
  @IsUUID()
  branchId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0)
  minQty: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxQty?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderPoint?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  safetyStock?: number;
}

export class QueryInventoryConfigDto {
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @Min(1)
  @IsOptional()
  limit?: number = 100;

  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
