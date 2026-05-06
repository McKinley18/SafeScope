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
exports.TaxonomyController = void 0;
const common_1 = require("@nestjs/common");
const taxonomy_service_1 = require("./taxonomy.service");
const taxonomy_config_1 = require("./taxonomy.config");
let TaxonomyController = class TaxonomyController {
    constructor(taxonomyService) {
        this.taxonomyService = taxonomyService;
    }
    getHazardCategories() {
        return taxonomy_config_1.HAZARD_CATEGORIES;
    }
    async exportRules() {
        const rules = await this.taxonomyService.findAllRules();
        const csv = 'code,severity,keywords\n' + rules.map(r => `${r.code},${r.severity},"${r.keywords.join(';')}"`).join('\n');
        return csv;
    }
    async importRules(dto, req) {
        const rows = dto.csv.split('\n').slice(1);
        for (const row of rows) {
            const [code, severity, keywords] = row.split(',');
            await this.taxonomyService.createRule({ code, severity: parseInt(severity), keywords: keywords.replace(/"/g, '').split(';') }, req.user.userId);
        }
        return { success: true };
    }
    createRule(dto, req) {
        return this.taxonomyService.createRule(dto, req.user.userId);
    }
    async rollbackRule(ruleId, versionId, req) {
        return this.taxonomyService.rollbackRule(ruleId, versionId, req.user.userId);
    }
    getSeverity() {
        return taxonomy_config_1.SEVERITY_LEVELS;
    }
};
exports.TaxonomyController = TaxonomyController;
__decorate([
    (0, common_1.Get)('hazard-categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxonomyController.prototype, "getHazardCategories", null);
__decorate([
    (0, common_1.Get)('rules/export'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaxonomyController.prototype, "exportRules", null);
__decorate([
    (0, common_1.Post)('rules/import'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaxonomyController.prototype, "importRules", null);
__decorate([
    (0, common_1.Post)('rules'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TaxonomyController.prototype, "createRule", null);
__decorate([
    (0, common_1.Post)('rules/:ruleId/rollback/:versionId'),
    __param(0, (0, common_1.Param)('ruleId')),
    __param(1, (0, common_1.Param)('versionId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TaxonomyController.prototype, "rollbackRule", null);
__decorate([
    (0, common_1.Get)('severity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxonomyController.prototype, "getSeverity", null);
exports.TaxonomyController = TaxonomyController = __decorate([
    (0, common_1.Controller)('taxonomy'),
    __metadata("design:paramtypes", [taxonomy_service_1.TaxonomyService])
], TaxonomyController);
//# sourceMappingURL=taxonomy.controller.js.map