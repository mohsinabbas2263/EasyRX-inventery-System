import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateSupplierDto {
    @ApiProperty()
    @IsUUID()
    companyId!: string;

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    contactPerson?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    taxNumber?: string;
}

export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
