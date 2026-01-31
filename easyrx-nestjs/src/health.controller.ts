import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/security/guards/jwt-auth.guard';

@Controller('health')
export class HealthController {
    @Get()
    @Public()
    health() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'EazyRX Backend',
            version: '1.0.0',
        };
    }
}
