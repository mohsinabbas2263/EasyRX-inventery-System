import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChartOfAccount, JournalEntry, JournalEntryLine]),
  ],
  providers: [AccountingService],
  controllers: [AccountingController],
  exports: [AccountingService, TypeOrmModule],
})
export class AccountingModule {}
