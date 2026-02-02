import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateControlledDispenseDto {
  @IsNotEmpty()
  @IsString()
  prescriptionRef: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  batchId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  patientName?: string;

  @IsOptional()
  @IsString()
  patientCnic?: string;
}
