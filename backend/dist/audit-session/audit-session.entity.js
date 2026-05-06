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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditSession = void 0;
const typeorm_1 = require("typeorm");
const audit_entry_entity_1 = require("./audit-entry.entity");
let AuditSession = class AuditSession {
};
exports.AuditSession = AuditSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditSession.prototype, "facilityName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditSession.prototype, "siteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditSession.prototype, "auditorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], AuditSession.prototype, "auditDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'msha_hybrid' }),
    __metadata("design:type", String)
], AuditSession.prototype, "standardsMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], AuditSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditSession.prototype, "sessionNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AuditSession.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audit_entry_entity_1.AuditEntry, (entry) => entry.auditSession),
    __metadata("design:type", Array)
], AuditSession.prototype, "entries", void 0);
exports.AuditSession = AuditSession = __decorate([
    (0, typeorm_1.Entity)('audit_sessions')
], AuditSession);
//# sourceMappingURL=audit-session.entity.js.map