"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSessionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const audit_session_controller_1 = require("./audit-session.controller");
const audit_session_service_1 = require("./audit-session.service");
const audit_analysis_service_1 = require("./audit-analysis.service");
const audit_session_entity_1 = require("./audit-session.entity");
const audit_entry_entity_1 = require("./audit-entry.entity");
const audit_entry_attachment_entity_1 = require("./entities/audit-entry-attachment.entity");
const audit_entry_finding_entity_1 = require("./entities/audit-entry-finding.entity");
let AuditSessionModule = class AuditSessionModule {
};
exports.AuditSessionModule = AuditSessionModule;
exports.AuditSessionModule = AuditSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                audit_session_entity_1.AuditSession,
                audit_entry_entity_1.AuditEntry,
                audit_entry_attachment_entity_1.AuditEntryAttachment,
                audit_entry_finding_entity_1.AuditEntryFinding,
            ]),
        ],
        controllers: [audit_session_controller_1.AuditSessionController],
        providers: [audit_session_service_1.AuditSessionService, audit_analysis_service_1.AuditAnalysisService],
        exports: [audit_session_service_1.AuditSessionService],
    })
], AuditSessionModule);
//# sourceMappingURL=audit-session.module.js.map