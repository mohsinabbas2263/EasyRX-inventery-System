import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import {
    RequirePermissions,
    PermissionCode,
} from '../security/decorators/permissions.decorator';

@ApiTags('transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService) { }

    @Post()
    @RequirePermissions(PermissionCode.INVENTORY_TRANSACT)
    @ApiOperation({ summary: 'Request a stock transfer from another branch' })
    requestTransfer(@Body() dto: CreateTransferDto) {
        return this.transfersService.requestTransfer(dto);
    }

    @Patch(':id/dispatch')
    @RequirePermissions(PermissionCode.INVENTORY_TRANSACT)
    @ApiOperation({ summary: 'Dispatch a requested transfer (Source branch)' })
    dispatchTransfer(@Param('id') id: string) {
        return this.transfersService.dispatchTransfer(id);
    }

    @Patch(':id/receive')
    @RequirePermissions(PermissionCode.INVENTORY_TRANSACT)
    @ApiOperation({ summary: 'Receive a dispatched transfer (Destination branch)' })
    receiveTransfer(@Param('id') id: string) {
        return this.transfersService.receiveTransfer(id);
    }

    @Get()
    @RequirePermissions(PermissionCode.INVENTORY_VIEW)
    @ApiOperation({ summary: 'Get all transfers involving the current branch' })
    findAll() {
        return this.transfersService.findAll();
    }
}
