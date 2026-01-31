import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities/user-permission.entity';
import { PermissionCode } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(UserPermission)
        private permissionsRepository: Repository<UserPermission>,
    ) {}

    async getUserPermissions(userId: string): Promise<string[]> {
        const permissions = await this.permissionsRepository.find({
            where: { userId },
        });
        return permissions.map((p) => p.permissionCode);
    }

    async assignBulk(userId: string, codes: string[], grantedBy: string): Promise<UserPermission[]> {
        const validCodes = Object.values(PermissionCode);
        const invalidCodes = codes.filter((code) => !validCodes.includes(code as PermissionCode));

        if (invalidCodes.length > 0) {
            throw new BadRequestException(`Invalid permission codes: ${invalidCodes.join(', ')}`);
        }

        const results: UserPermission[] = [];
        for (const code of codes) {
            const existing = await this.permissionsRepository.findOne({
                where: { userId, permissionCode: code },
            });

            if (!existing) {
                const perm = this.permissionsRepository.create({
                    userId,
                    permissionCode: code,
                    grantedBy,
                });
                results.push(await this.permissionsRepository.save(perm));
            }
        }
        return results;
    }

    async revoke(userId: string, code: string): Promise<void> {
        await this.permissionsRepository.delete({
            userId,
            permissionCode: code,
        });
    }

    async getAllPermissions(): Promise<string[]> {
        return Object.values(PermissionCode);
    }
}
