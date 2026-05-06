import { Repository } from 'typeorm';
import { AddReportEvidenceDto, CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { Report } from './entities/report.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { AuditService } from '../audit/audit.service';
import { ClassificationsService } from '../classifications/classifications.service';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { StandardsService } from '../standards/standards.service';
export declare class ReportsService {
    private reportsRepository;
    private attachmentsRepository;
    private reviewRepo;
    private actionRepo;
    private auditService;
    private classificationsService;
    private standardsService;
    constructor(reportsRepository: Repository<Report>, attachmentsRepository: Repository<ReportAttachment>, reviewRepo: Repository<Review>, actionRepo: Repository<CorrectiveAction>, auditService: AuditService, classificationsService: ClassificationsService, standardsService: StandardsService);
    getAudit(reportId: string): Promise<import("../audit/entities/audit-log.entity").AuditLog[]>;
    findOne(id: string): Promise<{
        classifications: import("../classifications/entities/classification.entity").Classification[];
        reviews: Review[];
        actions: CorrectiveAction[];
        id: string;
        displayId: string;
        attachments: ReportAttachment[];
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
    private buildFilter;
    findAll(options: {
        page: number;
        limit: number;
        status?: string;
        eventTypeCode?: string;
        tenantId?: string;
    }): Promise<{
        data: Report[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    export(status?: string, eventTypeCode?: string, tenantId?: string): Promise<Report[]>;
    create(dto: CreateReportDto): Promise<Report>;
    update(id: string, dto: UpdateReportDto): Promise<Report>;
    decideReview(id: string, dto: {
        decision: 'approved' | 'rejected';
        notes?: string;
    }): Promise<Report>;
    archive(id: string): Promise<Report>;
    softDelete(id: string): Promise<Report>;
    addEvidence(reportId: string, dto: AddReportEvidenceDto): Promise<{
        reportId: string;
        attachments: ReportAttachment[];
    }>;
    suggestStandards(reportId: string, source?: string): Promise<{
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
}
