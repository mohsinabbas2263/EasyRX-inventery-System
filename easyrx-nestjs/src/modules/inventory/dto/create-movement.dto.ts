import {
    IsUUID,
    IsEnum,
    IsNumber,
    Min,
    IsOptional,
    ValidateIf,
    IsString,
    IsBoolean,
} from 'class-validator';
import { MovementType, AdjustmentReason, ReferenceDocType } from '../entities/inventory-ledger.entity';

export class CreateMovementDto {
    @IsUUID()
    branchId: string;

    @IsUUID()
    productId: string;

    @IsUUID()
    @ValidateIf((obj) => obj.movementType !== MovementType.SALE)
    batchId?: string;

    @IsUUID()
    binId: string;

    @IsEnum(MovementType)
    movementType: MovementType;

    @IsNumber()
    @Min(0.001)
    qty: number;

    @IsNumber()
    @IsOptional()
    unitCost?: number;

    @IsEnum(AdjustmentReason)
    @IsOptional()
    reason?: AdjustmentReason;

    @IsEnum(ReferenceDocType)
    @IsOptional()
    referenceDocType?: ReferenceDocType;

    @IsUUID()
    @IsOptional()
    referenceDocId?: string;

    @IsBoolean()
    @IsOptional()
    allowNegativeStock?: boolean = false;
}
