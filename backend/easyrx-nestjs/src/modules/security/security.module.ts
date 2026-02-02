import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { PermissionsService } from './services/permissions.service';
import { AuditService } from './services/audit.service';
import { AuthController } from './controllers/auth.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { AuditController } from './controllers/audit.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { AuditLog } from './entities/audit-log.entity';
import { UserPermission } from './entities/user-permission.entity';
import { Permission } from './entities/permission.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forFeature([
      AuditLog,
      UserPermission,
      Permission,
      RefreshToken,
      User,
    ]),
  ],
  controllers: [AuthController, PermissionsController, AuditController],
  providers: [
    AuthService,
    PermissionsService,
    AuditService,
    JwtStrategy,
    JwtAuthGuard,
    PermissionsGuard,
    AuditInterceptor,
  ],
  exports: [
    AuthService,
    PermissionsService,
    AuditService,
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class SecurityModule {}
