import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { username },
        });
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }

        const { passwordHash, ...result } = user;
        return result;
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12); // Increased rounds to 12
    }

    async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
        const user = await this.usersRepository.findOne({
            where: { username: loginDto.username },
        });

        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            await this.auditService.createAuditLog({
                action: 'AUTH:LOGIN_FAILED',
                entityType: 'user',
                entityId: user?.userId,
                beforeData: { username: loginDto.username },
                afterData: { reason: 'Invalid credentials' },
                ipAddress,
                userAgent,
            });
            throw new UnauthorizedException('Invalid username or password');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User account is inactive');
        }

        const permissions = await this.permissionsService.getUserPermissions(user.userId);
        const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
        const allPermissions = [...new Set([...rolePermissions, ...permissions])];

        const payload = {
            sub: user.userId,
            username: user.username,
            branchId: user.branchId,
            companyId: user.companyId,
            role: user.role,
            permissions: allPermissions,
        };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.auditService.createAuditLog({
            userId: user.userId,
            branchId: user.branchId ?? undefined,
            companyId: user.companyId,
            action: 'AUTH:LOGIN_SUCCESS',
            entityType: 'user',
            entityId: user.userId,
            beforeData: undefined,
            afterData: { username: user.username, role: user.role },
            ipAddress,
            userAgent,
        });

        return {
            accessToken,
            refreshToken,
            user: {
                userId: user.userId,
                username: user.username,
                email: user.username, // Assuming username is email for now or needs to be updated in entity
                role: user.role,
                branchId: user.branchId,
                companyId: user.companyId,
            },
        };
    }

    async validateUserById(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { userId },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }
}
