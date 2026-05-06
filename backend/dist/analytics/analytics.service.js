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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const report_entity_1 = require("../reports/entities/report.entity");
let AnalyticsService = class AnalyticsService {
    constructor(reportsRepo) {
        this.reportsRepo = reportsRepo;
    }
    async getSafetyTrends() {
        const reports = await this.reportsRepo.find({
            where: {
                deletedAt: (0, typeorm_2.IsNull)(),
                archivedAt: (0, typeorm_2.IsNull)(),
            },
            order: { reportedDatetime: 'DESC' },
            take: 500,
        });
        const submittedReports = reports.filter((r) => ['submitted', 'reviewed', 'closed', 'draft'].includes(String(r.reportStatus || '').toLowerCase()));
        const hazardFamilies = new Map();
        const standards = new Map();
        const priorities = new Map();
        const areas = new Map();
        for (const report of submittedReports) {
            const likelyStandards = Array.isArray(report.likelyStandards)
                ? report.likelyStandards
                : [];
            for (const standard of likelyStandards) {
                const family = standard.primaryFamily || standard.family || 'other';
                const citation = standard.citation || 'Review Required';
                const priority = standard.suggestedPriority ||
                    standard.riskAssessment?.finalPriority ||
                    report.severity ||
                    'review';
                hazardFamilies.set(family, (hazardFamilies.get(family) || 0) + 1);
                standards.set(citation, (standards.get(citation) || 0) + 1);
                priorities.set(priority, (priorities.get(priority) || 0) + 1);
            }
            if (report.area) {
                areas.set(report.area, (areas.get(report.area) || 0) + 1);
            }
        }
        const top = (map, limit = 10) => Array.from(map.entries())
            .map(([label, count]) => ({ label, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        const highRiskCount = submittedReports.filter((r) => {
            const standards = Array.isArray(r.likelyStandards) ? r.likelyStandards : [];
            return standards.some((standard) => ['high', 'critical'].includes(String(standard.suggestedPriority ||
                standard.riskAssessment?.finalPriority ||
                r.severity ||
                '').toLowerCase()));
        }).length;
        const repeatThreshold = 3;
        const repeatIssues = Array.from(standards.entries())
            .filter(([_, count]) => count >= repeatThreshold)
            .map(([citation, count]) => ({ citation, count }));
        const topHazard = top(hazardFamilies, 1)[0]?.label || null;
        const riskTrend = submittedReports.length === 0
            ? 'insufficient_data'
            : highRiskCount > submittedReports.length * 0.3
                ? 'increasing'
                : highRiskCount > submittedReports.length * 0.1
                    ? 'stable'
                    : 'decreasing';
        return {
            totalReports: submittedReports.length,
            classifiedReports: submittedReports.filter((r) => r.aiStatus === 'classified').length,
            topHazardFamilies: top(hazardFamilies),
            topStandards: top(standards),
            priorityDistribution: top(priorities),
            repeatAreas: top(areas),
            highRiskCount,
            repeatIssues,
            dominantHazard: topHazard,
            riskTrend,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map