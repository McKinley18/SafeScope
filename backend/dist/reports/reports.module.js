"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const classifications_module_1 = require("../classifications/classifications.module");
const audit_module_1 = require("../audit/audit.module");
const review_entity_1 = require("../reviews/entities/review.entity");
const corrective_action_entity_1 = require("../corrective-actions/entities/corrective-action.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const executive_service_1 = require("./executive/executive.service");
const pdf_service_1 = require("./pdf/pdf.service");
const executive_controller_1 = require("./executive/executive.controller");
const report_entity_1 = require("./entities/report.entity");
const attachment_entity_1 = require("./entities/attachment.entity");
const standards_module_1 = require("../standards/standards.module");
const control_verifications_module_1 = require("../control-verifications/control-verifications.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [classifications_module_1.ClassificationsModule, audit_module_1.AuditModule, standards_module_1.StandardsModule,
            typeorm_1.TypeOrmModule.forFeature([report_entity_1.Report, attachment_entity_1.ReportAttachment, review_entity_1.Review, corrective_action_entity_1.CorrectiveAction]),
            control_verifications_module_1.ControlVerificationsModule,
        ],
        controllers: [reports_controller_1.ReportsController, executive_controller_1.ExecutiveController],
        providers: [reports_service_1.ReportsService, executive_service_1.ExecutiveService, pdf_service_1.PdfService],
        exports: [reports_service_1.ReportsService],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map