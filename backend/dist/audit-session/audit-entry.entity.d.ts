import { AuditSession } from './audit-session.entity';
import { AuditEntryAttachment } from './entities/audit-entry-attachment.entity';
import { AuditEntryFinding } from './entities/audit-entry-finding.entity';
export declare class AuditEntry {
    id: string;
    auditSessionId: string;
    auditSession: AuditSession;
    locationText: string;
    notes: string;
    verificationStatus: string;
    attachments: AuditEntryAttachment[];
    findings: AuditEntryFinding[];
}
