import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlledDispenseLog } from './entities/controlled-dispense-log.entity';
import { CreateControlledDispenseDto } from './dto/create-controlled-dispense.dto';

@Injectable()
export class ControlledDrugsService {
  constructor(
    @InjectRepository(ControlledDispenseLog)
    private logRepository: Repository<ControlledDispenseLog>,
  ) {}

  async logDispense(
    dto: CreateControlledDispenseDto,
    userInfo: { userId: string; companyId: string; branchId: string },
  ): Promise<ControlledDispenseLog> {
    const entity = this.logRepository.create({
      ...dto,
      pharmacistId: userInfo.userId,
      companyId: userInfo.companyId,
      branchId: userInfo.branchId,
    } as ControlledDispenseLog);
    return this.logRepository.save(entity);
  }
}
