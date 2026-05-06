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
exports.StandardsSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const standard_entity_1 = require("./entities/standard.entity");
const standards_seed_1 = require("./seeds/standards.seed");
const corrective_action_template_entity_1 = require("./entities/corrective-action-template.entity");
let StandardsSeedService = class StandardsSeedService {
    constructor(standardRepo, correctiveTemplateRepo) {
        this.standardRepo = standardRepo;
        this.correctiveTemplateRepo = correctiveTemplateRepo;
    }
    async seedDefaults() {
        let created = 0;
        let updated = 0;
        for (const item of standards_seed_1.standardSeeds) {
            if (!item || !item.citation) {
                console.warn('Skipping invalid standard seed row:', item);
                continue;
            }
            try {
                const existing = await this.standardRepo.findOne({
                    where: { citation: item.citation },
                });
                if (existing) {
                    await this.standardRepo.save(this.standardRepo.create({
                        ...existing,
                        ...item,
                    }));
                    updated += 1;
                }
                else {
                    await this.standardRepo.save(this.standardRepo.create({
                        ...item,
                    }));
                    created += 1;
                }
            }
            catch (error) {
                console.error('Standards seed failed for citation:', item.citation, error?.message || error);
                throw new Error(`Standards seed failed for ${item.citation}: ${error?.message || 'unknown error'}`);
            }
        }
        const standards = await this.standardRepo.find();
        for (const standard of standards) {
            const exists = await this.correctiveTemplateRepo.findOne({
                where: { standardId: standard.id },
            });
            if (exists)
                continue;
            await this.correctiveTemplateRepo.save(this.correctiveTemplateRepo.create({
                hazardCategoryCode: standard.keywords?.[0] || 'general',
                standardId: standard.id,
                title: `Corrective action for ${standard.citation}`,
                recommendedAction: `Correct the condition related to ${standard.title} and document verification.`,
                lowCostOption: 'Remove exposure, barricade the area if needed, and complete a documented field correction.',
                bestPracticeOption: 'Create a permanent engineered or administrative control, assign ownership, and verify completion.',
                verificationSteps: 'Verify the hazard was corrected, photograph the corrected condition, and document the responsible person/date.',
                estimatedRiskReduction: 70,
            }));
        }
        return { ok: true, created, updated, total: standards_seed_1.standardSeeds.length };
    }
};
exports.StandardsSeedService = StandardsSeedService;
exports.StandardsSeedService = StandardsSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(standard_entity_1.Standard)),
    __param(1, (0, typeorm_1.InjectRepository)(corrective_action_template_entity_1.CorrectiveActionTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StandardsSeedService);
//# sourceMappingURL=standards-seed.service.js.map