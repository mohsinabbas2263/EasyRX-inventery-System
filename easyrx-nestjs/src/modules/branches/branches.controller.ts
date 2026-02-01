import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { Permissions } from '../security/decorators/permissions.decorator';

@ApiTags('branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('branches')
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    @Permissions('BRANCHES_CREATE')
    @ApiOperation({ summary: 'Create a new branch' })
    create(@Body() createBranchDto: CreateBranchDto) {
        return this.branchesService.create(createBranchDto);
    }

    @Get()
    @Permissions('BRANCHES_VIEW')
    @ApiOperation({ summary: 'Get all branches for the users company' })
    findAll(@Request() req: any) {
        return this.branchesService.findAllByCompany(req.user.companyId);
    }

    @Get(':id')
    @Permissions('BRANCHES_VIEW')
    @ApiOperation({ summary: 'Get a specific branch' })
    findOne(@Param('id') id: string) {
        return this.branchesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('BRANCHES_UPDATE')
    @ApiOperation({ summary: 'Update a branch' })
    update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
        return this.branchesService.update(id, updateBranchDto);
    }

    @Delete(':id')
    @Permissions('BRANCHES_DELETE')
    @ApiOperation({ summary: 'Delete a branch' })
    remove(@Param('id') id: string) {
        return this.branchesService.remove(id);
    }
}
