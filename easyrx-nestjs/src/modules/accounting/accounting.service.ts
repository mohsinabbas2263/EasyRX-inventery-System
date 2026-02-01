import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import {
    CreateChartOfAccountDto,
} from './dto/chart-of-account.dto';
import { CreateJournalEntryDto } from './dto/journal-entry.dto';

@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(ChartOfAccount)
        private readonly coaRepository: Repository<ChartOfAccount>,
        @InjectRepository(JournalEntry)
        private readonly entryRepository: Repository<JournalEntry>,
        private readonly dataSource: DataSource,
    ) { }

    // --- Chart of Accounts ---
    async createCoA(dto: CreateChartOfAccountDto): Promise<ChartOfAccount> {
        const account = this.coaRepository.create(dto);
        return await this.coaRepository.save(account);
    }

    async findAllCoA(companyId: string): Promise<ChartOfAccount[]> {
        return await this.coaRepository.find({ where: { companyId } });
    }

    // --- Journal Entries ---
    async createJournalEntry(dto: CreateJournalEntryDto, userId: string): Promise<JournalEntry> {
        // 1. Validate balancing (Total Debit MUST equal Total Credit)
        const totalDebit = dto.lines.reduce((sum, line) => sum + line.debit, 0);
        const totalCredit = dto.lines.reduce((sum, line) => sum + line.credit, 0);

        if (Math.abs(totalDebit - totalCredit) > 0.001) {
            throw new BadRequestException(
                `Journal entry must be balanced. Total Debit: ${totalDebit}, Total Credit: ${totalCredit}`,
            );
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entry = this.entryRepository.create({
                ...dto,
                entryDate: new Date(dto.entryDate),
                createdBy: userId,
            });

            const savedEntry = await queryRunner.manager.save(entry);

            for (const lineDto of dto.lines) {
                const line = queryRunner.manager.create(JournalEntryLine, {
                    ...lineDto,
                    entryId: savedEntry.entryId,
                });
                await queryRunner.manager.save(line);
            }

            await queryRunner.commitTransaction();
            return savedEntry;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllEntries(branchId: string): Promise<JournalEntry[]> {
        return await this.entryRepository.find({
            where: { branchId },
            relations: ['lines', 'lines.account'],
        });
    }
}
