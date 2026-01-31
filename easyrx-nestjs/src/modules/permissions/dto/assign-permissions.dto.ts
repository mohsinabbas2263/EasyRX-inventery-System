import { IsNumber, IsArray, ArrayMinSize, IsString, MaxLength, Min } from 'class-validator';

export class AssignPermissionsDto {
    @IsNumber()
    @Min(1)
    userId: number;

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one permission code is required' })
    @IsString({ each: true })
    @MaxLength(100, { each: true })
    permissionCodes: string[];
}
