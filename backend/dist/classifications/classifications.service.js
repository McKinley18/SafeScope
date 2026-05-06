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
exports.ClassificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const classification_entity_1 = require("./entities/classification.entity");
const report_entity_1 = require("../reports/entities/report.entity");
const audit_service_1 = require("../audit/audit.service");
const taxonomy_service_1 = require("../taxonomy/taxonomy.service");
const rule_engine_service_1 = require("./rule-engine.service");
const entity_extractor_service_1 = require("./entity-extractor.service");
let ClassificationsService = class ClassificationsService {
    constructor(classificationRepository, reportRepository, auditService, taxonomyService, ruleEngine, entityExtractor) {
        this.classificationRepository = classificationRepository;
        this.reportRepository = reportRepository;
        this.auditService = auditService;
        this.taxonomyService = taxonomyService;
        this.ruleEngine = ruleEngine;
        this.entityExtractor = entityExtractor;
    }
    async findByReportId(reportId) {
        return this.classificationRepository.find({ where: { reportId } });
    }
    async classify(reportId) {
        const report = await this.reportRepository.findOne({ where: { id: reportId } });
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        const entities = this.entityExtractor.extract(report.narrative);
        const result = this.ruleEngine.classify(report.narrative);
        const classification = this.classificationRepository.create({
            reportId,
            classifierType: 'RULE_ENGINE_V1',
            classifierVersion: '1.0.0',
            eventTypeCode: report.eventTypeCode,
            hazardCategoryCode: result.hazardCategoryCode,
            severityLevel: result.severityLevel,
            confidenceScore: result.confidenceScore,
            requiresHumanReview: result.requiresHumanReview,
            extractedEntities: entities,
            reasoningSummary: { ...result.reasoningSummary, extractedEntities: entities },
        });
        const saved = await this.classificationRepository.save(classification);
        await this.auditService.log({
            entityType: 'CLASSIFICATION',
            entityId: saved.id,
            actionCode: 'CLASSIFICATION_CREATED',
            afterJson: saved,
            metadataJson: { reportId },
        });
        return saved;
    }
    async review(classificationId, action, notes, reason) {
        const classification = await this.classificationRepository.findOne({ where: { id: classificationId } });
        if (!classification)
            throw new common_1.NotFoundException('Classification not found');
        classification.classificationStatus = action;
        classification.reviewedAt = new Date();
        classification.reviewReason = reason || notes;
        await this.classificationRepository.save(classification);
        await this.auditService.log({
            entityType: 'CLASSIFICATION',
            entityId: classification.id,
            actionCode: `REVIEW_${action.toUpperCase()}`,
            afterJson: classification,
            metadataJson: { notes, reason },
        });
        return classification;
    }
};
exports.ClassificationsService = ClassificationsService;
exports.ClassificationsService = ClassificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(classification_entity_1.Classification)),
    __param(1, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService,
        taxonomy_service_1.TaxonomyService,
        rule_engine_service_1.RuleEngine,
        entity_extractor_service_1.EntityExtractorService])
], ClassificationsService);
//# sourceMappingURL=classifications.service.js.map