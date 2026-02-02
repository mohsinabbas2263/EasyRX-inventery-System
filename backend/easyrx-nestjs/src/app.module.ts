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
import { CompaniesModule } from './modules/companies/companies.module';
import { BranchesModule } from './modules/branches/branches.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { SyncModule } from './modules/sync/sync.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './modules/security/guards/jwt-auth.guard';
import { AuditInterceptor } from './modules/security/interceptors/audit.interceptor';
import { SharedModule } from './common/shared.module';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';

import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    SharedModule,
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: configService.get<number>('THROTTLE_TTL_SHORT', 1000),
          limit: configService.get<number>('THROTTLE_LIMIT_SHORT', 3),
        },
        {
          name: 'long',
          ttl: configService.get<number>('THROTTLE_TTL_LONG', 60000),
          limit: configService.get<number>('THROTTLE_LIMIT_LONG', 100),
        },
      ],
    }),
    // Core modules
    SecurityModule, // Includes Audit and Permissions functionality
    UsersModule,
    ProductsModule,
    // Feature modules
    InventoryModule,
    SalesModule,
    PurchaseModule,
    ReportsModule,
    CompaniesModule,
    BranchesModule,
    PharmacyModule,
    TransfersModule,
    SyncModule,
    AccountingModule,
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
      useClass: TenantInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule { }
