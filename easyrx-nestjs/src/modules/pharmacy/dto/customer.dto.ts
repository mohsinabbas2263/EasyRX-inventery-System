import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, IsNumber } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty()
    @IsUUID()
    companyId!: string;

    @ApiProperty()
    @IsString()
    firstName!: string;

    @ApiProperty()
    @IsString()
    lastName!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cnic?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    dateOfBirth?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    loyaltyPoints?: number;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
