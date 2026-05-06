import { AuditEntry } from '../audit-entry.entity';
export declare class AuditEntryFinding {
    id: string;
    auditEntryId: string;
    auditEntry: AuditEntry;
    title: string;
    observedCondition: string;
    hazardCategoryCode: string;
    applicableStandards: any;
    severityLevel: number;
    suggestedFix: string;
    confidenceScore: number;
    aiReasoning: Record<string, any>;
    verificationStatus: string;
}
