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
exports.ReportAttachment = void 0;
const typeorm_1 = require("typeorm");
const report_entity_1 = require("./report.entity");
let ReportAttachment = class ReportAttachment {
};
exports.ReportAttachment = ReportAttachment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReportAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportAttachment.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => report_entity_1.Report, (report) => report.attachments, { onDelete: 'CASCADE' }),
    __metadata("design:type", report_entity_1.Report)
], ReportAttachment.prototype, "report", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportAttachment.prototype, "imageUri", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReportAttachment.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ReportAttachment.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReportAttachment.prototype, "createdAt", void 0);
exports.ReportAttachment = ReportAttachment = __decorate([
    (0, typeorm_1.Entity)('report_attachments')
], ReportAttachment);
//# sourceMappingURL=attachment.entity.js.map