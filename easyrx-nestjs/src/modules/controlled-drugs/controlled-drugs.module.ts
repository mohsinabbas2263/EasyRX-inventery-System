import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlledDispenseLog } from './entities/controlled-dispense-log.entity';
import { ControlledDrugsService } from './controlled-drugs.service';
import { ControlledDrugsController } from './controlled-drugs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ControlledDispenseLog])],
  controllers: [ControlledDrugsController],
  providers: [ControlledDrugsService],
})
export class ControlledDrugsModule {}
