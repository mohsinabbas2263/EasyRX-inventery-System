import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { CreateChartOfAccountDto } from './dto/chart-of-account.dto';
import { CreateJournalEntryDto } from './dto/journal-entry.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('accounting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  // --- Chart of Accounts ---
  @Post('coa')
  @RequirePermissions(PermissionCode.ACCOUNTING_MANAGE)
  @ApiOperation({ summary: 'Create a new account in CoA' })
  createCoA(@Body() dto: CreateChartOfAccountDto) {
    return this.accountingService.createCoA(dto);
  }

  @Get('coa')
  @RequirePermissions(PermissionCode.ACCOUNTING_VIEW)
  @ApiOperation({ summary: 'Get all accounts in CoA' })
  findAllCoA(@NestRequest() req: RequestWithUser) {
    return this.accountingService.findAllCoA(req.user.companyId);
  }

  // --- Journal Entries ---
  @Post('entries')
  @RequirePermissions(PermissionCode.ACCOUNTING_MANAGE)
  @ApiOperation({ summary: 'Create a balanced journal entry' })
  createJournalEntry(
    @Body() dto: CreateJournalEntryDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.accountingService.createJournalEntry(dto, req.user.userId);
  }

  @Get('entries')
  @RequirePermissions(PermissionCode.ACCOUNTING_VIEW)
  @ApiOperation({ summary: 'Get all journal entries for the branch' })
  findAllEntries(@NestRequest() req: RequestWithUser) {
    return this.accountingService.findAllEntries(req.user.branchId || '');
  }
}
