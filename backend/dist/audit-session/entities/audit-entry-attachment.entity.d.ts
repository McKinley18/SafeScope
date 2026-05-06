import { AuditEntry } from '../audit-entry.entity';
export declare class AuditEntryAttachment {
    id: string;
    auditEntryId: string;
    auditEntry: AuditEntry;
    imageUri: string;
    mimeType: string;
    fileName: string;
}
