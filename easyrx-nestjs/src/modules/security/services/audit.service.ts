import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
// import { Parser } from 'json2csv';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditRepository: Repository<AuditLog>,
    ) { }

    async createAuditLog(data: Partial<AuditLog>): Promise<AuditLog> {
        const auditLog = this.auditRepository.create({
            ...data,
            createdAt: new Date(),
        });
        return this.auditRepository.save(auditLog);
    }

    async getAuditLogs(filter: {
        from?: Date;
        to?: Date;
        userId?: string;
        action?: string;
        entityType?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ data: AuditLog[]; total: number }> {
        const where: FindOptionsWhere<AuditLog> = {};

        if (filter.from || filter.to) {
            where.createdAt = Between(filter.from || new Date(0), filter.to || new Date());
        }
        if (filter.userId) where.userId = filter.userId;
        if (filter.action) where.action = filter.action;
        if (filter.entityType) where.entityType = filter.entityType;

        const [data, total] = await this.auditRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: filter.limit || 50,
            skip: filter.offset || 0,
        });

        return { data, total };
    }

    async exportAuditCsv(filter: {
        from?: Date;
        to?: Date;
        userId?: string;
        action?: string;
    }): Promise<string> {
        // const { data } = await this.getAuditLogs({ ...filter, limit: 10000 });

        // const records = data.map((log) => ({
        //     id: log.id,
        //     timestamp: log.createdAt.toISOString(),
        //     userId: log.userId,
        //     action: log.action,
        //     entity: log.entityType,
        //     entityId: log.entityId,
        //     ipAddress: log.ipAddress,
        //     userAgent: log.userAgent,
        //     changes: `Before: ${JSON.stringify(log.beforeData)} | After: ${JSON.stringify(log.afterData)}`,
        // }));

        // try {
        //     const parser = new Parser();
        //     return parser.parse(records);
        // } catch (error: any) {
        //     throw new Error(`CSV export failed: ${error.message}`);
        // }
        return '';
    }
}
