import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncQueue } from './entities/sync-queue.entity';
import { SyncEngineService } from './sync.service';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [TypeOrmModule.forFeature([SyncQueue]), SalesModule],
  providers: [SyncEngineService],
  exports: [SyncEngineService],
})
export class SyncModule {}
