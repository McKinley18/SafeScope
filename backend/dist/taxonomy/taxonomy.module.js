"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const taxonomy_controller_1 = require("./taxonomy.controller");
const taxonomy_service_1 = require("./taxonomy.service");
const rule_entity_1 = require("./entities/rule.entity");
const rule_version_entity_1 = require("./entities/rule-version.entity");
const audit_module_1 = require("../audit/audit.module");
let TaxonomyModule = class TaxonomyModule {
};
exports.TaxonomyModule = TaxonomyModule;
exports.TaxonomyModule = TaxonomyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([rule_entity_1.ClassificationRule, rule_version_entity_1.ClassificationRuleVersion]),
            audit_module_1.AuditModule,
        ],
        controllers: [taxonomy_controller_1.TaxonomyController],
        providers: [taxonomy_service_1.TaxonomyService],
        exports: [taxonomy_service_1.TaxonomyService],
    })
], TaxonomyModule);
//# sourceMappingURL=taxonomy.module.js.map