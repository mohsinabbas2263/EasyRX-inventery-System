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
    private readonly dataSource: DataSource,
  ) {}

  // --- Customers ---
  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(dto);
    return await this.customerRepository.save(customer);
  }

  async findAllCustomers(companyId: string): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { companyId } });
  }

  // --- Prescribers ---
  async createPrescriber(dto: CreatePrescriberDto): Promise<Prescriber> {
    const prescriber = this.prescriberRepository.create(dto);
    return await this.prescriberRepository.save(prescriber);
  }

  async findAllPrescribers(companyId: string): Promise<Prescriber[]> {
    return await this.prescriberRepository.find({ where: { companyId } });
  }

  // --- Prescriptions ---
  async createPrescription(
    dto: CreatePrescriptionDto,
    userId: string,
  ): Promise<Prescription> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { lines, ...prescriptionData } = dto;
      const prescription = this.prescriptionRepository.create({
        ...prescriptionData,
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
