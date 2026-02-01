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
    ) { }

    async getUserPermissions(userId: string): Promise<string[]> {
        const permissions = await this.permissionsRepository.find({
            where: { userId },
            relations: ['permission'],
        });
        return permissions.map((p) => p.permission.code);
    }

    async assignBulk(userId: string, codes: string[]): Promise<UserPermission[]> {
        const validCodes = Object.values(PermissionCode);
        const invalidCodes = codes.filter((code) => !validCodes.includes(code as PermissionCode));

        if (invalidCodes.length > 0) {
            throw new BadRequestException(`Invalid permission codes: ${invalidCodes.join(', ')}`);
        }

        const results: UserPermission[] = [];
        for (const code of codes) {
            await this.permissionsRepository.findOne({
                where: { userId, permission: { code } },
                relations: ['permission'],
            });

            // If not found, skip for now - real system would resolve code -> id
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
