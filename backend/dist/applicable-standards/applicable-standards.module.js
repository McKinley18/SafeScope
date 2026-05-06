"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicableStandardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const standard_entity_1 = require("../standards/entities/standard.entity");
const corrective_action_template_entity_1 = require("../standards/entities/corrective-action-template.entity");
const regulatory_section_entity_1 = require("../regulatory/entities/regulatory-section.entity");
const applicable_standards_controller_1 = require("./applicable-standards.controller");
const applicable_standards_service_1 = require("./applicable-standards.service");
let ApplicableStandardsModule = class ApplicableStandardsModule {
};
exports.ApplicableStandardsModule = ApplicableStandardsModule;
exports.ApplicableStandardsModule = ApplicableStandardsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([standard_entity_1.Standard, corrective_action_template_entity_1.CorrectiveActionTemplate, regulatory_section_entity_1.RegulatorySection])],
        controllers: [applicable_standards_controller_1.ApplicableStandardsController],
        providers: [applicable_standards_service_1.ApplicableStandardsService],
    })
], ApplicableStandardsModule);
//# sourceMappingURL=applicable-standards.module.js.map