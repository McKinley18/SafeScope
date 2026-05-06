"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("./entities/report.entity");
const attachment_entity_1 = require("./entities/attachment.entity");
const audit_service_1 = require("../audit/audit.service");
const classifications_service_1 = require("../classifications/classifications.service");
const review_entity_1 = require("../reviews/entities/review.entity");
const corrective_action_entity_1 = require("../corrective-actions/entities/corrective-action.entity");
const standards_service_1 = require("../standards/standards.service");
let ReportsService = class ReportsService {
    constructor(reportsRepository, attachmentsRepository, reviewRepo, actionRepo, auditService, classificationsService, standardsService) {
        this.reportsRepository = reportsRepository;
        this.attachmentsRepository = attachmentsRepository;
        this.reviewRepo = reviewRepo;
        this.actionRepo = actionRepo;
        this.auditService = auditService;
        this.classificationsService = classificationsService;
        this.standardsService = standardsService;
    }
    async getAudit(reportId) {
        const report = await this.reportsRepository.findOne({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return this.auditService.getAuditByEntityId(reportId);
    }
    async findOne(id) {
        const report = await this.reportsRepository.findOne({
            where: { id },
            relations: ['attachments'],
        });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const classifications = await this.classificationsService.findByReportId(id);
        const reviews = await this.reviewRepo.find({ where: { reportId: id } });
        const actions = await this.actionRepo.find({ where: { reportId: id } });
        return {
            ...report,
            classifications,
            reviews,
            actions,
        };
    }
    buildFilter(status, eventTypeCode, tenantId) {
        const where = {};
        if (tenantId)
            where.tenantId = tenantId;
        if (status)
            where.reportStatus = status;
        if (eventTypeCode)
            where.eventTypeCode = eventTypeCode;
        where.deletedAt = null;
        where.archivedAt = null;
        return where;
    }
    async findAll(options) {
        const { page, limit, status, eventTypeCode, tenantId } = options;
        const where = this.buildFilter(status, eventTypeCode, tenantId);
        const [data, total] = await this.reportsRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
            order: { reportedDatetime: 'DESC' },
        });
        return {
            data,
            meta: { total, page, limit },
        };
    }
    async export(status, eventTypeCode, tenantId) {
        const where = this.buildFilter(status, eventTypeCode, tenantId);
        return this.reportsRepository.find({ where, order: { reportedDatetime: 'DESC' } });
    }
    async create(dto) {
        const count = await this.reportsRepository.count();
        const displayId = `RPT-${String(count + 1001).padStart(4, '0')}`;
        const report = this.reportsRepository.create({
            ...dto,
            displayId,
            eventDatetime: dto.eventDatetime ? new Date(dto.eventDatetime) : undefined,
            reportedDatetime: new Date(),
            reportStatus: dto.reportStatus ?? 'draft',
            intakeStatus: 'received',
        });
        const saved = await this.reportsRepository.save(report);
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: saved.id,
            actionCode: 'REPORT_CREATED',
            afterJson: saved,
        });
        return saved;
    }
    async update(id, dto) {
        const report = await this.reportsRepository.findOne({ where: { id } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const next = this.reportsRepository.merge(report, {
            ...dto,
            eventDatetime: dto.eventDatetime ? new Date(dto.eventDatetime) : report.eventDatetime,
        });
        const saved = await this.reportsRepository.save(next);
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: saved.id,
            actionCode: 'REPORT_UPDATED',
            afterJson: saved,
        });
        return saved;
    }
    async decideReview(id, dto) {
        const report = await this.reportsRepository.findOne({ where: { id } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const decision = dto.decision;
        const saved = await this.reportsRepository.save({
            ...report,
            reportStatus: decision,
            reviewDecision: decision,
            reviewDecisionNotes: dto.notes || report.reviewDecisionNotes || report.notes,
            notes: dto.notes || report.notes,
            reviewedAt: new Date(),
        });
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: saved.id,
            actionCode: decision === 'approved' ? 'REPORT_APPROVED' : 'REPORT_REJECTED',
            afterJson: saved,
        });
        return saved;
    }
    async archive(id) {
        const report = await this.reportsRepository.findOne({ where: { id } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const saved = await this.reportsRepository.save({
            ...report,
            reportStatus: 'archived',
            archivedAt: new Date(),
        });
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: saved.id,
            actionCode: 'REPORT_ARCHIVED',
            afterJson: saved,
        });
        return saved;
    }
    async softDelete(id) {
        const report = await this.reportsRepository.findOne({ where: { id } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const saved = await this.reportsRepository.save({
            ...report,
            reportStatus: 'deleted',
            deletedAt: new Date(),
        });
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: saved.id,
            actionCode: 'REPORT_DELETED',
            afterJson: saved,
        });
        return saved;
    }
    async addEvidence(reportId, dto) {
        const report = await this.reportsRepository.findOne({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const attachments = dto.attachments.map((item) => this.attachmentsRepository.create({
            reportId,
            imageUri: item.uri,
            mimeType: item.mimeType,
            fileName: item.fileName,
        }));
        const savedAttachments = await this.attachmentsRepository.save(attachments);
        await this.auditService.log({
            entityType: 'REPORT',
            entityId: reportId,
            actionCode: 'REPORT_EVIDENCE_ADDED',
            afterJson: savedAttachments,
        });
        return {
            reportId,
            attachments: savedAttachments,
        };
    }
    async suggestStandards(reportId, source) {
        const report = await this.reportsRepository.findOne({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const description = [
            report.hazardDescription,
            report.narrative,
            report.equipment,
            report.area,
            report.notes,
        ]
            .filter(Boolean)
            .join(' ');
        const standards = await this.standardsService.suggest(description, source);
        return {
            reportId,
            description,
            standards,
            disclaimer: 'Possible standard matches are generated from keyword matching and must be verified by a qualified user.',
        };
    }
    async detectHazard(reportId) {
        const report = await this.reportsRepository.findOne({
            where: { id: reportId },
            relations: ['attachments'],
        });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        let suggestedHazardDescription = 'Potential workplace hazard detected';
        let observationSummary = 'The uploaded image may contain a workplace condition that requires review.';
        let confidence = 'medium';
        if (report.attachments?.length) {
            suggestedHazardDescription = 'Possible missing guard or exposed hazard area';
            observationSummary =
                'The image appears to show equipment or a work area with a potentially unsafe condition that should be reviewed by a qualified person.';
            confidence = 'medium';
        }
        return {
            reportId,
            suggestedHazardDescription,
            observationSummary,
            confidence,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __param(1, (0, typeorm_1.InjectRepository)(attachment_entity_1.ReportAttachment)),
    __param(2, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(3, (0, typeorm_1.InjectRepository)(corrective_action_entity_1.CorrectiveAction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService,
        classifications_service_1.ClassificationsService,
        standards_service_1.StandardsService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map