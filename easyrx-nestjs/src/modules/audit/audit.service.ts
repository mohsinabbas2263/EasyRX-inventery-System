import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditRepository: Repository<AuditLog>,
    ) { }

    async log(data: Partial<AuditLog>): Promise<AuditLog> {
        const log = this.auditRepository.create(data);
        return this.auditRepository.save(log);
    }

    async findAll(query: any): Promise<AuditLog[]> {
        return this.auditRepository.find({
            take: 50,
            order: { createdAt: 'DESC' }
        });
    }

    async exportToCsv(query: any): Promise<string> {
        const logs = await this.findAll(query);
        if (logs.length === 0) return '';

        // Explicitly define what logic to use if logs[0] is undefined
        const headers = Object.keys(logs[0]).join(',');
        const rows = logs.map(log => Object.values(log).join(','));
        return [headers, ...rows].join('\n');
    }
}
