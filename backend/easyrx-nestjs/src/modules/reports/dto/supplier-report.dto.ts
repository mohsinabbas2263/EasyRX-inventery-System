import { IsDateString, IsUUID, IsOptional, Min, Max } from 'class-validator';

export class SupplierReportQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsOptional()
  @Min(1)
  @Max(500)
  limit?: number = 100;

  @IsOptional()
  @Min(0)
  offset?: number = 0;
}

export class SupplierPerformanceDto {
  supplierId: string;
  supplierName: string;
  totalSpend: number;
  grnCount: number;
  avgDeliveryDays: number;
  onTimePercent: number;
  fillRate: number;
  qualityIssues: number;
}

export class StaffProductivityQueryDto {
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class StaffProductivityDto {
  userId: string;
  staffName: string;
  invoiceCount: number;
  totalSalesValue: number;
  avgSaleValue: number;
  itemsSold: number;
  avgItemsPerInvoice: number;
  avgSaleTime: number; // seconds
}
