import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PharmacyService } from './pharmacy.service';
import { CreateCustomerDto } from './dto/customer.dto';
import { CreatePrescriberDto } from './dto/prescriber.dto';
import { CreatePrescriptionDto } from './dto/prescription.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import {
  RequirePermissions,
  PermissionCode,
} from '../security/decorators/permissions.decorator';

@ApiTags('pharmacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // --- Customers ---
  @Post('customers')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Register a new customer' })
  createCustomer(@Body() dto: CreateCustomerDto) {
    return this.pharmacyService.createCustomer(dto);
  }

  @Get('customers')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Get all customers' })
  findAllCustomers(@NestRequest() req: RequestWithUser) {
    return this.pharmacyService.findAllCustomers(req.user.companyId);
  }

  // --- Prescribers ---
  @Post('prescribers')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Register a new doctor/prescriber' })
  createPrescriber(@Body() dto: CreatePrescriberDto) {
    return this.pharmacyService.createPrescriber(dto);
  }

  @Get('prescribers')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Get all prescribers' })
  findAllPrescribers(@NestRequest() req: RequestWithUser) {
    return this.pharmacyService.findAllPrescribers(req.user.companyId);
  }

  // --- Prescriptions ---
  @Post('prescriptions')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Create a new prescription' })
  createPrescription(
    @Body() dto: CreatePrescriptionDto,
    @NestRequest() req: RequestWithUser,
  ) {
    return this.pharmacyService.createPrescription(dto, req.user.userId);
  }

  @Get('customers/:id/prescriptions')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Get prescriptions for a specific customer' })
  findAllPrescriptions(@Param('id') customerId: string) {
    return this.pharmacyService.findAllPrescriptions(customerId);
  }
}
