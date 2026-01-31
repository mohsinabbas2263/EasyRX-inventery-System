import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionCode } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionCode[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // Check if user has ALL required permissions
        // Logic: User permissions array must include all required permissions
        // Note: HO_ADMIN typically has all permissions, but here we check explicitly

        if (!user || !user.permissions) {
            throw new ForbiddenException('User permissions not found');
        }

        const hasPermissions = requiredPermissions.every((permission) =>
            user.permissions.includes(permission)
        );

        if (!hasPermissions) {
            throw new ForbiddenException('Insufficient permissions');
        }

        return true;
    }
}
