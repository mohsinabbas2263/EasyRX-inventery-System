import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { PermissionsService } from './permissions.service';
import { AuditService } from './audit.service';
import { ROLE_PERMISSIONS, UserRole } from '../decorators/permissions.decorator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private permissionsService: PermissionsService,
        private auditService: AuditService,
    ) {}

    async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
        const user = await this.usersRepository.findOne({
            where: { username: loginDto.email },
        });

        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            await this.auditService.createAuditLog({
                action: 'AUTH:LOGIN_FAILED',
                entityType: 'user',
                entityId: user?.userId,
                beforeData: { email: loginDto.email },
                afterData: { reason: 'Invalid credentials' },
                ipAddress,
                userAgent,
            });
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User account is inactive');
        }

        const permissions = await this.permissionsService.getUserPermissions(user.userId);
        const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
        const allPermissions = [...new Set([...rolePermissions, ...permissions])];

        const payload = {
            sub: user.userId,
            email: user.username,
            branchId: user.branchId,
            companyId: user.companyId,
            role: user.role,
            permissions: allPermissions,
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.auditService.createAuditLog({
            userId: user.userId,
            branchId: user.branchId,
            companyId: user.companyId,
            action: 'AUTH:LOGIN_SUCCESS',
            entityType: 'user',
            entityId: user.userId,
            beforeData: null,
            afterData: { email: user.username, role: user.role },
            ipAddress,
            userAgent,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                userId: user.userId,
                email: user.username,
                role: user.role,
                branchId: user.branchId,
                companyId: user.companyId,
            },
        };
    }

    async validateUser(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { userId },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }
}
