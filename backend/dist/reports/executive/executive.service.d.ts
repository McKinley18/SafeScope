import { Repository } from "typeorm";
import { Report } from "../entities/report.entity";
import { ControlVerificationsService } from "../../control-verifications/control-verifications.service";
import { StandardsService } from "../../standards/standards.service";
export declare class ExecutiveService {
    private readonly repo;
    private readonly controlVerificationSvc;
    private readonly standardsService;
    constructor(repo: Repository<Report>, controlVerificationSvc: ControlVerificationsService, standardsService: StandardsService);
    generateExecutiveSummary(reportId: string): Promise<{
        reportId: string;
        overview: string;
        riskEvaluation: string;
        riskPriorities: string;
        immediateAction: string;
        prioritizedActions: string;
        standards: string;
        correctiveActions: string;
        complianceNote: string;
        metadata: {
            complianceScore: number;
            controlsRequired: number;
            controlsMissing: number;
            severity: string;
            hasStandards: boolean;
            findingsCount: number;
            riskScore: number;
            riskBand: string;
        };
        findings: any[];
    }>;
}
