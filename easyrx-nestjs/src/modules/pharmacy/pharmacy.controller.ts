import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
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
  constructor(private readonly pharmacyService: PharmacyService) { }

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
  findAllCustomers() {
    return this.pharmacyService.findAllCustomers();
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
  findAllPrescribers() {
    return this.pharmacyService.findAllPrescribers();
  }

  // --- Prescriptions ---
  @Post('prescriptions')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Create a new prescription' })
  createPrescription(
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.pharmacyService.createPrescription(dto);
  }

  @Get('customers/:id/prescriptions')
  @RequirePermissions(PermissionCode.PHARMACY_MANAGE)
  @ApiOperation({ summary: 'Get prescriptions for a specific customer' })
  findAllPrescriptions(@Param('id') customerId: string) {
    return this.pharmacyService.findAllPrescriptions(customerId);
  }
}
