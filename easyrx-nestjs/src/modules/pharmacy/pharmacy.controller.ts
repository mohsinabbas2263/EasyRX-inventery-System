import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { PharmacyService } from './pharmacy.service';
import { CreateCustomerDto } from './dto/customer.dto';
import { CreatePrescriberDto } from './dto/prescriber.dto';
import { CreatePrescriptionDto } from './dto/prescription.dto';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../security/guards/permissions.guard';
import { Permissions } from '../security/decorators/permissions.decorator';

@ApiTags('pharmacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('pharmacy')
export class PharmacyController {
    constructor(private readonly pharmacyService: PharmacyService) { }

    // --- Customers ---
    @Post('customers')
    @Permissions('CUSTOMERS_CREATE')
    @ApiOperation({ summary: 'Register a new customer' })
    createCustomer(@Body() dto: CreateCustomerDto) {
        return this.pharmacyService.createCustomer(dto);
    }

    @Get('customers')
    @Permissions('CUSTOMERS_VIEW')
    @ApiOperation({ summary: 'Get all customers' })
    findAllCustomers(@Request() req: any) {
        return this.pharmacyService.findAllCustomers(req.user.companyId);
    }

    // --- Prescribers ---
    @Post('prescribers')
    @Permissions('PRESCRIBERS_CREATE')
    @ApiOperation({ summary: 'Register a new doctor/prescriber' })
    createPrescriber(@Body() dto: CreatePrescriberDto) {
        return this.pharmacyService.createPrescriber(dto);
    }

    @Get('prescribers')
    @Permissions('PRESCRIBERS_VIEW')
    @ApiOperation({ summary: 'Get all prescribers' })
    findAllPrescribers(@Request() req: any) {
        return this.pharmacyService.findAllPrescribers(req.user.companyId);
    }

    // --- Prescriptions ---
    @Post('prescriptions')
    @Permissions('PRESCRIPTIONS_CREATE')
    @ApiOperation({ summary: 'Create a new prescription' })
    createPrescription(@Body() dto: CreatePrescriptionDto, @Request() req: any) {
        return this.pharmacyService.createPrescription(dto, req.user.userId);
    }

    @Get('customers/:id/prescriptions')
    @Permissions('PRESCRIPTIONS_VIEW')
    @ApiOperation({ summary: 'Get prescriptions for a specific customer' })
    findAllPrescriptions(@Param('id') customerId: string) {
        return this.pharmacyService.findAllPrescriptions(customerId);
    }
}
