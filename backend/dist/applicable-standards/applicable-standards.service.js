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
exports.ApplicableStandardsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const standard_entity_1 = require("../standards/entities/standard.entity");
let ApplicableStandardsService = class ApplicableStandardsService {
    constructor(standardRepo) {
        this.standardRepo = standardRepo;
    }
    async suggest(description, hazardCategory, source, limit = 5) {
        const siteType = source === 'MSHA'
            ? 'mining'
            : source === 'OSHA_CONSTRUCTION'
                ? 'construction'
                : source === 'OSHA_GENERAL_INDUSTRY'
                    ? 'general_industry'
                    : undefined;
        const observation = (description || '').toLowerCase();
        const all = await this.standardRepo.find({
            where: siteType ? { scopeCode: siteType, isActive: true } : { isActive: true },
            take: 5000,
        });
        const results = all
            .map((standard) => {
            let score = 0;
            const matchingReasons = [];
            const keywords = standard.keywords || [];
            for (const keyword of keywords) {
                if (observation.includes(keyword.toLowerCase())) {
                    score += 12;
                    matchingReasons.push(`keyword: ${keyword}`);
                }
            }
            const titleWords = standard.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, ' ')
                .split(/\s+/)
                .filter((word) => word.length > 4);
            for (const word of [...new Set(titleWords)]) {
                if (observation.includes(word)) {
                    score += 6;
                    matchingReasons.push(`title: ${word}`);
                }
            }
            if (siteType && standard.scopeCode === siteType) {
                score += 15;
                matchingReasons.push(`scope: ${siteType}`);
            }
            return {
                id: standard.id,
                citation: standard.citation,
                heading: standard.title,
                summary: standard.plainLanguageSummary,
                agencyCode: standard.agencyCode,
                scopeCode: standard.scopeCode,
                score,
                confidence: Math.min(99, Math.round(score)),
                matchingReasons,
            };
        })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        return results;
    }
};
exports.ApplicableStandardsService = ApplicableStandardsService;
exports.ApplicableStandardsService = ApplicableStandardsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(standard_entity_1.Standard)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApplicableStandardsService);
//# sourceMappingURL=applicable-standards.service.js.map