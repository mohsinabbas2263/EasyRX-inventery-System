import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsString,
  Min,
  Max,
} from 'class-validator';

export enum GroupByPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class SalesReportQueryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsEnum(GroupByPeriod)
  @IsOptional()
  groupBy: GroupByPeriod = GroupByPeriod.DAY;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  @Min(1)
  @Max(500)
  limit?: number = 100;

  @IsOptional()
  @Min(0)
  offset?: number = 0;
}

export class SalesBucketDto {
  date: string;
  netSales: number;
  grossSales: number;
  costOfGoods: number;
  margin: number;
  marginPercent: number;
  itemsSold: number;
  invoiceCount: number;
}

export class SalesReportResponseDto {
  buckets: SalesBucketDto[];
  total: {
    netSales: number;
    grossSales: number;
    costOfGoods: number;
    margin: number;
    marginPercent: number;
    itemsSold: number;
    invoiceCount: number;
  };
  period: {
    from: string;
    to: string;
    groupBy: GroupByPeriod;
  };
}
