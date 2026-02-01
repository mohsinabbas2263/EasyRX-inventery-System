import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { CreateChartOfAccountDto } from './dto/chart-of-account.dto';
import { CreateJournalEntryDto } from './dto/journal-entry.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { Permissions } from '../security/decorators/permissions.decorator';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('accounting')
export class AccountingController {
    constructor(private readonly accountingService: AccountingService) { }

    // --- Chart of Accounts ---
    @Post('coa')
    @Permissions('COA_CREATE')
    @ApiOperation({ summary: 'Create a new account in CoA' })
    createCoA(@Body() dto: CreateChartOfAccountDto) {
        return this.accountingService.createCoA(dto);
    }

    @Get('coa')
    @Permissions('COA_VIEW')
    @ApiOperation({ summary: 'Get all accounts in CoA' })
    findAllCoA(@Request() req: any) {
        return this.accountingService.findAllCoA(req.user.companyId);
    }

    // --- Journal Entries ---
    @Post('entries')
    @Permissions('JOURNAL_ENTRIES_CREATE')
    @ApiOperation({ summary: 'Create a balanced journal entry' })
    createJournalEntry(@Body() dto: CreateJournalEntryDto, @Request() req: any) {
        return this.accountingService.createJournalEntry(dto, req.user.userId);
    }

    @Get('entries')
    @Permissions('JOURNAL_ENTRIES_VIEW')
    @ApiOperation({ summary: 'Get all journal entries for the branch' })
    findAllEntries(@Request() req: any) {
        return this.accountingService.findAllEntries(req.headers['x-branch-id']);
    }
}
