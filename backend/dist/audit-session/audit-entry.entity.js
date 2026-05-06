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
exports.AuditEntry = void 0;
const typeorm_1 = require("typeorm");
const audit_session_entity_1 = require("./audit-session.entity");
const audit_entry_attachment_entity_1 = require("./entities/audit-entry-attachment.entity");
const audit_entry_finding_entity_1 = require("./entities/audit-entry-finding.entity");
let AuditEntry = class AuditEntry {
};
exports.AuditEntry = AuditEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditEntry.prototype, "auditSessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => audit_session_entity_1.AuditSession, (session) => session.entries, { onDelete: 'CASCADE' }),
    __metadata("design:type", audit_session_entity_1.AuditSession)
], AuditEntry.prototype, "auditSession", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditEntry.prototype, "locationText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditEntry.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], AuditEntry.prototype, "verificationStatus", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audit_entry_attachment_entity_1.AuditEntryAttachment, (attachment) => attachment.auditEntry),
    __metadata("design:type", Array)
], AuditEntry.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audit_entry_finding_entity_1.AuditEntryFinding, (finding) => finding.auditEntry),
    __metadata("design:type", Array)
], AuditEntry.prototype, "findings", void 0);
exports.AuditEntry = AuditEntry = __decorate([
    (0, typeorm_1.Entity)('audit_entries')
], AuditEntry);
//# sourceMappingURL=audit-entry.entity.js.map