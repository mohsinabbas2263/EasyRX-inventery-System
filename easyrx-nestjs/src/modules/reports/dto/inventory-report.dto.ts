import { IsUUID, IsOptional, Min, IsNumber } from 'class-validator';

export class ExpiryReportQueryDto {
    @IsUUID()
    @IsOptional()
    branchId?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    daysThreshold: number = 90;

    @IsOptional()
    @Min(1)
    limit?: number = 500;

    @IsOptional()
    @Min(0)
    offset?: number = 0;
}

export class ExpiryRiskDto {
    productId: string;
    productName: string;
    batchNo: string;
    expiryDate: string;
    qtyOnHand: number;
    daysToExpiry: number;
    riskLevel: 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'NORMAL';
}

export class AgingReportQueryDto {
    @IsUUID()
    @IsOptional()
    branchId?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    minDaysStagnant: number = 180;
}

export class StockAgingDto {
    productId: string;
    productName: string;
    category: string;
    qtyOnHand: number;
    unitCost: number;
    totalValue: number;
    lastMovementDate: string;
    daysSinceMovement: number;
    movementType: 'FAST' | 'SLOW' | 'DEAD';
}
