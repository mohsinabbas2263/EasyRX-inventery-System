import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlledDispenseLog } from './entities/controlled-dispense-log.entity';

@Injectable()
export class ControlledDrugsService {
    constructor(
        @InjectRepository(ControlledDispenseLog)
        private logRepository: Repository<ControlledDispenseLog>,
    ) { }

    async logDispense(data: any, userId: number): Promise<ControlledDispenseLog> {
        const entity = this.logRepository.create({
            ...data,
            pharmacistId: userId
        } as ControlledDispenseLog); // Cast to entity type if needed
        return this.logRepository.save(entity);
    }
}
