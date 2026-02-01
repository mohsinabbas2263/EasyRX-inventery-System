import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export class SalesQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    fromDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    toDate?: string;

    @ApiPropertyOptional({ enum: ['PENDING', 'POSTED', 'CANCELLED'] })
    @IsOptional()
    @IsEnum(['PENDING', 'POSTED', 'CANCELLED'])
    status?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    customerId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    branchId?: string;
}
