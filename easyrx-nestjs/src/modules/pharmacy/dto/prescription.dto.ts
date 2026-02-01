import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PrescriptionLineDto {
    @ApiProperty()
    @IsUUID()
    productId!: string;

    @ApiProperty()
    @IsNumber()
    @Min(0.01)
    quantity!: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    dosage?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    frequency?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    durationDays?: number;
}

export class CreatePrescriptionDto {
    @ApiProperty()
    @IsUUID()
    customerId!: string;

    @ApiProperty()
    @IsUUID()
    prescriberId!: string;

    @ApiProperty()
    @IsDateString()
    prescriptionDate!: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    expiryDate?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ type: [PrescriptionLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PrescriptionLineDto)
    lines!: PrescriptionLineDto[];

    @ApiPropertyOptional()
    @IsEnum(['PENDING', 'PARTIAL', 'DISPENSED', 'CANCELLED'])
    @IsOptional()
    status?: string;
}
