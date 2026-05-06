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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt = require("jsonwebtoken");
const report_dto_1 = require("./dto/report.dto");
const classifications_service_1 = require("../classifications/classifications.service");
let ReportsController = class ReportsController {
    constructor(reportsService, classificationsService) {
        this.reportsService = reportsService;
        this.classificationsService = classificationsService;
    }
    getAuthContext(authHeader) {
        try {
            const token = authHeader?.replace('Bearer ', '');
            if (!token)
                return { tenantId: 'default', userId: undefined };
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'safescope_dev_secret_change_me');
            return {
                tenantId: decoded.tenantId || 'default',
                userId: decoded.sub,
            };
        }
        catch {
            return { tenantId: 'default', userId: undefined };
        }
    }
    findAll(authorization, page = 1, limit = 20, status, eventTypeCode) {
        const auth = this.getAuthContext(authorization);
        return this.reportsService.findAll({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status,
            eventTypeCode,
            tenantId: auth.tenantId,
        });
    }
    findOne(id) {
        return this.reportsService.findOne(id);
    }
    create(authorization, createReportDto) {
        const auth = this.getAuthContext(authorization);
        return this.reportsService.create({
            ...createReportDto,
            tenantId: auth.tenantId,
            createdByUserId: auth.userId,
        });
    }
    update(id, updateReportDto) {
        return this.reportsService.update(id, updateReportDto);
    }
    archive(id) {
        return this.reportsService.archive(id);
    }
    softDelete(id) {
        return this.reportsService.softDelete(id);
    }
    decideReview(id, body) {
        return this.reportsService.decideReview(id, body);
    }
    addEvidence(reportId, addReportEvidenceDto) {
        return this.reportsService.addEvidence(reportId, addReportEvidenceDto);
    }
    suggestStandards(reportId, body) {
        return this.reportsService.suggestStandards(reportId, body?.source);
    }
    detectHazard(reportId) {
        return this.reportsService.detectHazard(reportId);
    }
    async classify(reportId, body) {
        const report = await this.reportsService.findOne(reportId);
        const observation = body?.observation ||
            report?.hazardDescription ||
            report?.narrative ||
            report?.description ||
            report?.title ||
            '';
        const context = {
            industryScope: body?.context?.industryScope ||
                report?.industryScope ||
                report?.regulatoryScope ||
                report?.scope ||
                'mining',
            ...(body?.context || {}),
        };
        await this.reportsService.update(reportId, {
            aiStatus: 'classified',
            confidenceScore: null,
            severity: "unknown",
            likelyStandards: [
                {
                    citation: null,
                    agency: null,
                    scope: null,
                    family: null,
                    primaryFamily: null,
                    secondaryFamilies: [],
                    conditionId: null,
                    confidence: null,
                    reviewRequired: null,
                    suggestedPriority: null,
                    correctiveActions: [],
                    verificationSteps: [],
                    riskAssessment: null,
                },
            ],
        });
        return {
            reportId,
            observation,
            context,
            classification: null,
        };
    }
    findByReport(reportId) {
        return this.classificationsService.findByReportId(reportId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('eventTypeCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, report_dto_1.CreateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/archive'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "archive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Post)(':id/review-decision'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "decideReview", null);
__decorate([
    (0, common_1.Post)(':reportId/evidence'),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, report_dto_1.AddReportEvidenceDto]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "addEvidence", null);
__decorate([
    (0, common_1.Post)(':reportId/standards/suggest'),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "suggestStandards", null);
__decorate([
    (0, common_1.Post)(':reportId/detect-hazard'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "detectHazard", null);
__decorate([
    (0, common_1.Post)(':reportId/classify'),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "classify", null);
__decorate([
    (0, common_1.Get)(':reportId/classifications'),
    __param(0, (0, common_1.Param)('reportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "findByReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService,
        classifications_service_1.ClassificationsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map