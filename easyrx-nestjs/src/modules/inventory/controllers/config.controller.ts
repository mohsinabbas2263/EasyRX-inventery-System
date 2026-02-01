import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    Request,
    BadRequestException,
} from '@nestjs/common';
import { InventoryConfigService } from '../services/inventory-config.service';
import { InventoryConfigDto, QueryInventoryConfigDto } from '../dto/inventory-config.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../security/guards/permissions.guard';
import { RequirePermissions, PermissionCode } from '../../security/decorators/permissions.decorator';
import { AuditAction } from '../../security/decorators/audit.decorator';

@Controller('api/v1/inventory/config')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConfigController {
    constructor(private configService: InventoryConfigService) { }

    @Get()
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CONFIG_LIST')
    async getConfig(
        @Query() query: QueryInventoryConfigDto,
        @Request() req: any,
    ) {
        if (req.user.role !== 'HO_ADMIN' && query.branchId && query.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        if (req.user.role !== 'HO_ADMIN') {
            query.branchId = req.user.branchId;
        }

        return this.configService.findAll(query);
    }

    @Get(':id')
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    async getConfigById(@Param('id') id: string) {
        return this.configService.findOne(id);
    }

    @Post()
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CONFIG_CREATE')
    async createConfig(
        @Body() dto: InventoryConfigDto,
        @Request() req: any,
    ) {
        if (req.user.role !== 'HO_ADMIN' && dto.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        if (req.user.role !== 'HO_ADMIN') {
            dto.branchId = req.user.branchId;
        }

        return this.configService.create(dto);
    }

    @Patch(':id')
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CONFIG_UPDATE')
    async updateConfig(
        @Param('id') id: string,
        @Body() dto: Partial<InventoryConfigDto>,
        @Request() req: any,
    ) {
        const existing = await this.configService.findOne(id);
        if (req.user.role !== 'HO_ADMIN' && existing.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        return this.configService.update(id, dto);
    }

    @Delete(':id')
    @RequirePermissions(PermissionCode.INVENTORY_ADJUST)
    @AuditAction('INVENTORY:CONFIG_DELETE')
    async deleteConfig(
        @Param('id') id: string,
        @Request() req: any,
    ) {
        const existing = await this.configService.findOne(id);
        if (req.user.role !== 'HO_ADMIN' && existing.branchId !== req.user.branchId) {
            throw new BadRequestException('Unauthorized');
        }

        await this.configService.delete(id);
        return { success: true };
    }
}
