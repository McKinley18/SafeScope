import { Repository } from 'typeorm';
import { AuditSession } from './audit-session.entity';
import { AuditEntry } from './audit-entry.entity';
export declare class AuditSessionService {
    private readonly auditSessionRepo;
    private readonly auditEntryRepo;
    constructor(auditSessionRepo: Repository<AuditSession>, auditEntryRepo: Repository<AuditEntry>);
    createSession(dto: Partial<AuditSession>): Promise<AuditSession>;
    addEntry(sessionId: string, dto: Partial<AuditEntry>): Promise<AuditEntry>;
    publish(sessionId: string): Promise<AuditSession>;
    findAll(): Promise<AuditSession[]>;
    findOne(id: string): Promise<AuditSession>;
}
