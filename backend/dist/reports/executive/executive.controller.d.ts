import { Response } from 'express';
import { ExecutiveService } from './executive.service';
import { PdfService } from '../pdf/pdf.service';
export declare class ExecutiveController {
    private readonly service;
    private readonly pdf;
    constructor(service: ExecutiveService, pdf: PdfService);
    getExecutiveSummary(id: string): Promise<{
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
    getExecutivePdf(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
