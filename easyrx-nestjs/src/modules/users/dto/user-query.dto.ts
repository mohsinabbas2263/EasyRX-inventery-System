import { IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
    @IsOptional()
    @IsString()
    branchId?: string;

    @IsOptional()
    @IsString()
    role?: string;
}
