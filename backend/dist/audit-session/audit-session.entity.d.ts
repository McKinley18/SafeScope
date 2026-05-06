import { AuditEntry } from './audit-entry.entity';
export declare class AuditSession {
    id: string;
    facilityName: string;
    siteId: string;
    auditorName: string;
    auditDate: string;
    standardsMode: string;
    status: string;
    sessionNotes: string;
    publishedAt: Date;
    entries: AuditEntry[];
}
