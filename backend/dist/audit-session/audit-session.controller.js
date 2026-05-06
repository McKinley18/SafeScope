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
exports.AuditSessionController = void 0;
const common_1 = require("@nestjs/common");
const audit_session_service_1 = require("./audit-session.service");
const audit_analysis_service_1 = require("./audit-analysis.service");
let AuditSessionController = class AuditSessionController {
    constructor(sessionService, analysisService) {
        this.sessionService = sessionService;
        this.analysisService = analysisService;
    }
    createSession(dto) {
        return this.sessionService.createSession(dto);
    }
    findAll() {
        return this.sessionService.findAll();
    }
    findOne(id) {
        return this.sessionService.findOne(id);
    }
    addEntry(id, dto) {
        return this.sessionService.addEntry(id, dto);
    }
    analyzeEntry(entryId, dto) {
        return this.analysisService.analyzeEntry({
            notes: dto?.notes,
            locationText: dto?.locationText,
        });
    }
    publish(id) {
        return this.sessionService.publish(id);
    }
};
exports.AuditSessionController = AuditSessionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/entries'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "addEntry", null);
__decorate([
    (0, common_1.Post)(':sessionId/entries/:entryId/analyze'),
    __param(0, (0, common_1.Param)('entryId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "analyzeEntry", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuditSessionController.prototype, "publish", null);
exports.AuditSessionController = AuditSessionController = __decorate([
    (0, common_1.Controller)('audit-sessions'),
    __metadata("design:paramtypes", [audit_session_service_1.AuditSessionService,
        audit_analysis_service_1.AuditAnalysisService])
], AuditSessionController);
//# sourceMappingURL=audit-session.controller.js.map