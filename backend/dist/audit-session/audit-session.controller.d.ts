import { AuditSessionService } from './audit-session.service';
import { AuditAnalysisService } from './audit-analysis.service';
export declare class AuditSessionController {
    private readonly sessionService;
    private readonly analysisService;
    constructor(sessionService: AuditSessionService, analysisService: AuditAnalysisService);
    createSession(dto: any): Promise<import("./audit-session.entity").AuditSession>;
    findAll(): Promise<import("./audit-session.entity").AuditSession[]>;
    findOne(id: string): Promise<import("./audit-session.entity").AuditSession>;
    addEntry(id: string, dto: any): Promise<import("./audit-entry.entity").AuditEntry>;
    analyzeEntry(entryId: string, dto: any): Promise<{
        title: string;
        observedCondition: string;
        hazardCategoryCode: string;
        applicableStandards: any[];
        severityLevel: number;
        suggestedFix: string;
        confidenceScore: number;
        aiReasoning: {
            summary: string;
            methodology: string;
            confidence: number;
        };
        verificationStatus: string;
    }>;
    publish(id: string): Promise<import("./audit-session.entity").AuditSession>;
}
