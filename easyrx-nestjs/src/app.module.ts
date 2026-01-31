import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { SecurityModule } from './modules/security/security.module';
import { ReportsModule } from './modules/reports/reports.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './modules/security/guards/jwt-auth.guard';
import { AuditInterceptor } from './modules/security/interceptors/audit.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DATABASE_HOST', 'localhost'),
                port: configService.get('DATABASE_PORT', 5432),
                username: configService.get('DATABASE_USER', 'postgres'),
                password: configService.get('DATABASE_PASSWORD'),
                database: configService.get('DATABASE_NAME', 'easyrx'),
                entities: ['dist/**/*.entity.js'],
                synchronize: false, // Use migrations instead
                logging: configService.get('DB_LOGGING', false),
            }),
        }),
        // CacheModule.register({
        //     isGlobal: true,
        //     ttl: 5 * 60 * 1000, // 5 minutes default
        //     max: 1000,
        // }),
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3,
            },
            {
                name: 'medium',
                ttl: 15000,
                limit: 5,
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100,
            },
        ]),
        // Core modules
        SecurityModule, // Includes Audit and Permissions functionality
        UsersModule,
        ProductsModule,
        // Feature modules
        InventoryModule,
        SalesModule,
        PurchaseModule,
        ReportsModule,
    ],
    controllers: [HealthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor,
        },
    ],
})
export class AppModule { }
