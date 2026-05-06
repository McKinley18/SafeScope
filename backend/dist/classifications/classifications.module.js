"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const classifications_controller_1 = require("./classifications.controller");
const classifications_service_1 = require("./classifications.service");
const classification_entity_1 = require("./entities/classification.entity");
const report_entity_1 = require("../reports/entities/report.entity");
const audit_module_1 = require("../audit/audit.module");
const taxonomy_module_1 = require("../taxonomy/taxonomy.module");
const rule_engine_service_1 = require("./rule-engine.service");
const entity_extractor_service_1 = require("./entity-extractor.service");
let ClassificationsModule = class ClassificationsModule {
};
exports.ClassificationsModule = ClassificationsModule;
exports.ClassificationsModule = ClassificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([classification_entity_1.Classification, report_entity_1.Report]),
            audit_module_1.AuditModule,
            taxonomy_module_1.TaxonomyModule,
        ],
        controllers: [classifications_controller_1.ClassificationsController],
        providers: [
            classifications_service_1.ClassificationsService,
            rule_engine_service_1.RuleEngine,
            entity_extractor_service_1.EntityExtractorService,
        ],
        exports: [classifications_service_1.ClassificationsService],
    })
], ClassificationsModule);
//# sourceMappingURL=classifications.module.js.map