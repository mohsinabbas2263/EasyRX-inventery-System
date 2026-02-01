import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class JournalEntryLineDto {
    @ApiProperty()
    @IsUUID()
    accountId!: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    debit!: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    credit!: number;
}

export class CreateJournalEntryDto {
    @ApiProperty()
    @IsUUID()
    branchId!: string;

    @ApiProperty()
    @IsDateString()
    entryDate!: string;

    @ApiProperty()
    @IsString()
    description!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    documentType?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    documentId?: string;

    @ApiProperty({ type: [JournalEntryLineDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => JournalEntryLineDto)
    lines!: JournalEntryLineDto[];
}
