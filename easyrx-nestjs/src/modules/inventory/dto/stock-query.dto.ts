import {
    IsUUID,
    IsOptional,
    IsBoolean,
    Min,
    Max,
    IsString,
} from 'class-validator';

export class StockQueryDto {
    @IsUUID()
    branchId: string;

    @IsUUID()
    @IsOptional()
    productId?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    includeBatches: boolean = true;

    @IsBoolean()
    @IsOptional()
    includeBins: boolean = false;

    @IsBoolean()
    @IsOptional()
    onlyNonExpired: boolean = false;

    @IsBoolean()
    @IsOptional()
    onlyPositive: boolean = true;

    @Min(1)
    @Max(1000)
    @IsOptional()
    limit?: number = 100;

    @Min(0)
    @IsOptional()
    offset?: number = 0;
}

export class StockLevelResponseDto {
    productId: string;
    productName: string;
    category: string;
    qtyOnHand: number;
    batches?: {
        batchId: string;
        batchNo: string;
        expiryDate: string;
        qtyOnHand: number;
        daysToExpiry: number;
        isExpired: boolean;
        bins?: {
            binId: string;
            binCode: string;
            qtyOnHand: number;
        }[];
    }[];
}
