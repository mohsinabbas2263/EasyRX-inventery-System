import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { Permission } from '../entities/permission.entity';
import { PermissionCode } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserPermission)
    private permissionsRepository: Repository<UserPermission>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getUserPermissions(userId: string): Promise<string[]> {
    const permissions = await this.permissionsRepository.find({
      where: { userId },
      relations: ['permission'],
    });
    return permissions.map((p) => p.permission.code);
  }

  async assignBulk(userId: string, codes: string[]): Promise<UserPermission[]> {
    const validCodes = Object.values(PermissionCode);
    const invalidCodes = codes.filter(
      (code) => !validCodes.includes(code as PermissionCode),
    );

    if (invalidCodes.length > 0) {
      throw new BadRequestException(
        `Invalid permission codes: ${invalidCodes.join(', ')}`,
      );
    }

    const results: UserPermission[] = [];
    for (const code of codes) {
      // 1. Get Permission entity
      const permission = await this.permissionRepository.findOne({
        where: { code },
      });
      if (!permission) continue;

      // 2. Check if already assigned
      let userPerm = await this.permissionsRepository.findOne({
        where: { userId, permissionId: permission.permissionId },
      });

      if (!userPerm) {
        userPerm = this.permissionsRepository.create({
          userId,
          permissionId: permission.permissionId,
        });
        results.push(await this.permissionsRepository.save(userPerm));
      } else {
        results.push(userPerm);
      }
    }
    return results;
  }

  async revoke(userId: string, code: string): Promise<void> {
    const perm = await this.permissionsRepository.findOne({
      where: { userId, permission: { code } },
      relations: ['permission'],
    });
    if (perm) {
      await this.permissionsRepository.delete(perm.userPermissionId);
    }
  }

  async getAllPermissions(): Promise<string[]> {
    return Object.values(PermissionCode);
  }
}
