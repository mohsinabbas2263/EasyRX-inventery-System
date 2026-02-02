import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Prescriber } from './entities/prescriber.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionLine } from './entities/prescription-line.entity';
import { CreateCustomerDto } from './dto/customer.dto';
import { CreatePrescriberDto } from './dto/prescriber.dto';
import { CreatePrescriptionDto } from './dto/prescription.dto';
import { TenantContextService } from '../../common/services/tenant-context.service';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Prescriber)
    private readonly prescriberRepository: Repository<Prescriber>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,
    @InjectRepository(PrescriptionLine)
    private readonly lineRepository: Repository<PrescriptionLine>,
    private readonly tenantContext: TenantContextService,
    private readonly dataSource: DataSource,
  ) { }

  // --- Customers ---
  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create({
      ...dto,
      companyId: this.tenantContext.companyId!
    });
    return await this.customerRepository.save(customer);
  }

  async findAllCustomers(): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: { companyId: this.tenantContext.companyId }
    });
  }

  // --- Prescribers ---
  async createPrescriber(dto: CreatePrescriberDto): Promise<Prescriber> {
    const prescriber = this.prescriberRepository.create({
      ...dto,
      companyId: this.tenantContext.companyId!
    });
    return await this.prescriberRepository.save(prescriber);
  }

  async findAllPrescribers(): Promise<Prescriber[]> {
    return await this.prescriberRepository.find({
      where: { companyId: this.tenantContext.companyId }
    });
  }

  // --- Prescriptions ---
  async createPrescription(
    dto: CreatePrescriptionDto,
  ): Promise<Prescription> {
    const userId = this.tenantContext.userId;
    const companyId = this.tenantContext.companyId;

    if (!userId || !companyId) {
      throw new Error('User or Company context not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { lines, ...prescriptionData } = dto;
      const prescription = this.prescriptionRepository.create({
        ...prescriptionData,
        companyId,
        branchId: this.tenantContext.branchId!,
        prescriptionDate: new Date(dto.prescriptionDate),
        createdBy: userId,
        status: dto.status || 'PENDING',
      });

      const savedPrescription = await queryRunner.manager.save(prescription);

      for (const lineDto of lines) {
        const line = this.lineRepository.create({
          ...lineDto,
          prescriptionId: savedPrescription.prescriptionId,
        });
        await queryRunner.manager.save(line);
      }

      await queryRunner.commitTransaction();
      return savedPrescription;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllPrescriptions(customerId: string): Promise<Prescription[]> {
    return await this.prescriptionRepository.find({
      where: { customerId },
      relations: ['lines', 'prescriber'],
    });
  }
}
