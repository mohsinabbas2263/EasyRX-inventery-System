import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Prescriber } from './entities/prescriber.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionLine } from './entities/prescription-line.entity';
import { ControlledDispenseLog } from './entities/controlled-dispense-log.entity';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Customer,
            Prescriber,
            Prescription,
            PrescriptionLine,
            ControlledDispenseLog,
        ]),
    ],
    providers: [PharmacyService],
    controllers: [PharmacyController],
    exports: [PharmacyService, TypeOrmModule],
})
export class PharmacyModule { }
