import { IsEnum, IsUUID, IsString } from 'class-validator';
import { UserRole } from '../decorators/permissions.decorator';

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class AssignPermissionsDto {
  @IsUUID()
  userId: string;

  @IsString({ each: true })
  permissionCodes: string[];
}
