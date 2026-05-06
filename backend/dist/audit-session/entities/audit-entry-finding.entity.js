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
exports.AuditEntryFinding = void 0;
const typeorm_1 = require("typeorm");
const audit_entry_entity_1 = require("../audit-entry.entity");
let AuditEntryFinding = class AuditEntryFinding {
};
exports.AuditEntryFinding = AuditEntryFinding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "auditEntryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => audit_entry_entity_1.AuditEntry, (entry) => entry.findings, { onDelete: 'CASCADE' }),
    __metadata("design:type", audit_entry_entity_1.AuditEntry)
], AuditEntryFinding.prototype, "auditEntry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "observedCondition", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "hazardCategoryCode", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], AuditEntryFinding.prototype, "applicableStandards", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], AuditEntryFinding.prototype, "severityLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "suggestedFix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], AuditEntryFinding.prototype, "confidenceScore", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], AuditEntryFinding.prototype, "aiReasoning", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'draft' }),
    __metadata("design:type", String)
], AuditEntryFinding.prototype, "verificationStatus", void 0);
exports.AuditEntryFinding = AuditEntryFinding = __decorate([
    (0, typeorm_1.Entity)('audit_entry_findings')
], AuditEntryFinding);
//# sourceMappingURL=audit-entry-finding.entity.js.map