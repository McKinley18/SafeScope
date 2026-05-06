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
exports.TaxonomyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rule_entity_1 = require("./entities/rule.entity");
const rule_version_entity_1 = require("./entities/rule-version.entity");
const audit_service_1 = require("../audit/audit.service");
const taxonomy_config_1 = require("./taxonomy.config");
let TaxonomyService = class TaxonomyService {
    constructor(ruleRepo, versionRepo, auditService) {
        this.ruleRepo = ruleRepo;
        this.versionRepo = versionRepo;
        this.auditService = auditService;
    }
    getHazardCategories() {
        return taxonomy_config_1.HAZARD_CATEGORIES;
    }
    getSeverityLevels() {
        return taxonomy_config_1.SEVERITY_LEVELS;
    }
    async findAllRules() {
        return this.ruleRepo.find();
    }
    async createRule(dto, userId) {
        if (!/^[a-z_]+$/.test(dto.code)) {
            throw new Error('Code must be lowercase and underscored');
        }
        if (dto.severity < 1 || dto.severity > 5) {
            throw new Error('Severity must be 1-5');
        }
        if (dto.isActive && (!dto.keywords || dto.keywords.length === 0)) {
            throw new Error('Active rules must have keywords');
        }
        const existing = await this.ruleRepo.findOne({ where: { code: dto.code } });
        if (existing) {
            throw new Error('Code already exists');
        }
        const rule = this.ruleRepo.create(dto);
        const saved = await this.ruleRepo.save(rule);
        await this.auditService.log({
            entityType: 'TAXONOMY_RULE',
            entityId: saved.id,
            actionCode: 'RULE_CREATED',
            afterJson: saved,
            actorUserId: userId,
        });
        return saved;
    }
    async rollbackRule(ruleId, versionId, userId) {
        const version = await this.versionRepo.findOne({ where: { id: versionId } });
        if (!version) {
            throw new Error('Version not found');
        }
        const rule = await this.ruleRepo.findOne({ where: { id: ruleId } });
        if (!rule) {
            throw new Error('Rule not found');
        }
        const before = { ...rule };
        Object.assign(rule, version.snapshot);
        const saved = await this.ruleRepo.save(rule);
        await this.auditService.log({
            entityType: 'TAXONOMY_RULE',
            entityId: saved.id,
            actionCode: 'RULE_ROLLED_BACK',
            beforeJson: before,
            afterJson: saved,
            metadataJson: { versionId },
            actorUserId: userId,
        });
        return saved;
    }
};
exports.TaxonomyService = TaxonomyService;
exports.TaxonomyService = TaxonomyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rule_entity_1.ClassificationRule)),
    __param(1, (0, typeorm_1.InjectRepository)(rule_version_entity_1.ClassificationRuleVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], TaxonomyService);
//# sourceMappingURL=taxonomy.service.js.map