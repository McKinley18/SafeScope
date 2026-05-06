import { ReportsService } from './reports.service';
import { AddReportEvidenceDto, CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ClassificationsService } from '../classifications/classifications.service';
export declare class ReportsController {
    private readonly reportsService;
    private readonly classificationsService;
    constructor(reportsService: ReportsService, classificationsService: ClassificationsService);
    private getAuthContext;
    findAll(authorization: string, page?: number, limit?: number, status?: string, eventTypeCode?: string): Promise<{
        data: import("./entities/report.entity").Report[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(id: string): Promise<{
        classifications: import("../classifications/entities/classification.entity").Classification[];
        reviews: import("../reviews/entities/review.entity").Review[];
        actions: import("../corrective-actions/entities/corrective-action.entity").CorrectiveAction[];
        id: string;
        displayId: string;
        attachments: import("./entities/attachment.entity").ReportAttachment[];
        tenantId: string;
        createdByUserId: string;
        siteId: string;
        sourceType: string;
        eventDatetime: Date;
        reportedDatetime: Date;
        eventTypeCode: string;
        title: string;
        narrative: string;
        intakeStatus: string;
        aiStatus: string;
        reportStatus: string;
        confidenceScore: number;
        hazardDescription: string;
        area: string;
        equipment: string;
        workActivity: string;
        severity: string;
        immediateDanger: boolean;
        notes: string;
        likelyStandards: any[];
        reviewDecision: string;
        reviewDecisionNotes: string;
        reviewedAt: Date;
        createdAt: Date;
        archivedAt: Date;
        deletedAt: Date;
        updatedAt: Date;
    }>;
    create(authorization: string, createReportDto: CreateReportDto): Promise<import("./entities/report.entity").Report>;
    update(id: string, updateReportDto: UpdateReportDto): Promise<import("./entities/report.entity").Report>;
    archive(id: string): Promise<import("./entities/report.entity").Report>;
    softDelete(id: string): Promise<import("./entities/report.entity").Report>;
    decideReview(id: string, body: {
        decision: 'approved' | 'rejected';
        notes?: string;
    }): Promise<import("./entities/report.entity").Report>;
    addEvidence(reportId: string, addReportEvidenceDto: AddReportEvidenceDto): Promise<{
        reportId: string;
        attachments: import("./entities/attachment.entity").ReportAttachment[];
    }>;
    suggestStandards(reportId: string, body: {
        source?: string;
    }): Promise<{
        reportId: string;
        description: string;
        standards: {
            standardId: string;
            agencyCode: string;
            citation: string;
            title: string;
            scopeCode: string;
            confidence: number;
            confidenceLabel: string;
            plainLanguageSummary?: string;
            why: string[];
            cautions: string[];
        }[];
        disclaimer: string;
    }>;
    detectHazard(reportId: string): Promise<{
        reportId: string;
        suggestedHazardDescription: string;
        observationSummary: string;
        confidence: string;
    }>;
    classify(reportId: string, body: {
        observation?: string;
        context?: any;
    }): Promise<{
        reportId: string;
        observation: any;
        context: any;
        classification: any;
    }>;
    findByReport(reportId: string): Promise<import("../classifications/entities/classification.entity").Classification[]>;
}
