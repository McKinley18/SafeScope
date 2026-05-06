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
exports.AuditEntryAttachment = void 0;
const typeorm_1 = require("typeorm");
const audit_entry_entity_1 = require("../audit-entry.entity");
let AuditEntryAttachment = class AuditEntryAttachment {
};
exports.AuditEntryAttachment = AuditEntryAttachment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AuditEntryAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditEntryAttachment.prototype, "auditEntryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => audit_entry_entity_1.AuditEntry, (entry) => entry.attachments, { onDelete: 'CASCADE' }),
    __metadata("design:type", audit_entry_entity_1.AuditEntry)
], AuditEntryAttachment.prototype, "auditEntry", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AuditEntryAttachment.prototype, "imageUri", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditEntryAttachment.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AuditEntryAttachment.prototype, "fileName", void 0);
exports.AuditEntryAttachment = AuditEntryAttachment = __decorate([
    (0, typeorm_1.Entity)('audit_entry_attachments')
], AuditEntryAttachment);
//# sourceMappingURL=audit-entry-attachment.entity.js.map