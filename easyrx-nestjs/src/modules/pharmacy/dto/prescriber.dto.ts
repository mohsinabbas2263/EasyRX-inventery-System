import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreatePrescriberDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  specialization!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  licenseNumber?: string;

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
  clinicAddress?: string;
}

export class UpdatePrescriberDto extends PartialType(CreatePrescriberDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
