import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './entities/user-permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

@Global() // Global to be easily accessible in guards
@Module({
    imports: [TypeOrmModule.forFeature([UserPermission])],
    controllers: [PermissionsController],
    providers: [PermissionsService],
    exports: [PermissionsService],
})
export class PermissionsModule { }
