import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsNumber,
    MaxLength,
    Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Paracetamol 500mg Tablets' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    brandName: string;

    @ApiPropertyOptional({ example: 'Paracetamol' })
    @IsString()
    @IsOptional()
    @MaxLength(255)
    genericName?: string;

    @ApiPropertyOptional({ example: '500mg' })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    strength?: string;

    @ApiPropertyOptional({ example: 'Tablet' })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    dosageForm?: string;

    @ApiPropertyOptional({ example: '1234567890123' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    barcode1d?: string;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    isControlledDrug?: boolean;

    @ApiPropertyOptional({ example: false })
    @IsBoolean()
    @IsOptional()
    isPrescriptionRequired?: boolean;

    @ApiPropertyOptional({ example: 100 })
    @IsNumber()
    @IsOptional()
    @Min(0)
    reorderLevel?: number;

    @ApiPropertyOptional({ example: 10.50 })
    @IsNumber()
    @IsOptional()
    @Min(0)
    defaultSellingPrice?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;
}
