import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty()
    @IsUUID()
    companyId!: string;

    @ApiProperty()
    @IsString()
    name!: string;

    @ApiProperty()
    @IsString()
    code!: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    addressLine1?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    city?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    email?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
