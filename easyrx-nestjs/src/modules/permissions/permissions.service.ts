import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPermission } from './entities/user-permission.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(UserPermission)
        private permissionsRepository: Repository<UserPermission>,
    ) { }

    async getUserPermissions(userId: number): Promise<string[]> {
        const permissions = await this.permissionsRepository.find({
            where: { userId }
        });
        return permissions.map(p => p.permissionCode);
    }

    async assignBulk(userId: number, codes: string[], grantedBy: number): Promise<UserPermission[]> {
        // Basic implementation: delete existing and re-insert, or upsert.
        // For simplicity, we'll just insert non-existing ones.
        const results: UserPermission[] = [];
        for (const code of codes) {
            const existing = await this.permissionsRepository.findOne({
                where: { userId, permissionCode: code }
            });

            if (!existing) {
                const perm = this.permissionsRepository.create({
                    userId,
                    permissionCode: code,
                    grantedBy
                });
                results.push(await this.permissionsRepository.save(perm));
            }
        }
        return results;
    }
}
