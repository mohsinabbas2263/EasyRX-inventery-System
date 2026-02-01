import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @RequirePermissions(PermissionCode.COMPANY_MANAGE)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @RequirePermissions(PermissionCode.COMPANY_MANAGE)
  @ApiOperation({ summary: 'Get all companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.COMPANY_MANAGE)
  @ApiOperation({ summary: 'Get a specific company' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PermissionCode.COMPANY_MANAGE)
  @ApiOperation({ summary: 'Update a company' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.COMPANY_MANAGE)
  @ApiOperation({ summary: 'Delete a company' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
