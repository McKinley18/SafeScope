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
exports.Standard = void 0;
const typeorm_1 = require("typeorm");
let Standard = class Standard {
};
exports.Standard = Standard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Standard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'agency_code' }),
    __metadata("design:type", String)
], Standard.prototype, "agencyCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Standard.prototype, "citation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'part_number', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "partNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subpart', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "subpart", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Standard.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'standard_text', type: 'text' }),
    __metadata("design:type", String)
], Standard.prototype, "standardText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'plain_language_summary', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "plainLanguageSummary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scope_code', nullable: true }),
    __metadata("design:type", String)
], Standard.prototype, "scopeCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hazard_codes', type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Standard.prototype, "hazardCodes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'required_controls', type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Standard.prototype, "requiredControls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'keywords', type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Standard.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'severity_weight', default: 1 }),
    __metadata("design:type", Number)
], Standard.prototype, "severityWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Standard.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Standard.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Standard.prototype, "updatedAt", void 0);
exports.Standard = Standard = __decorate([
    (0, typeorm_1.Entity)('standards_master'),
    (0, typeorm_1.Index)(['agencyCode', 'citation'], { unique: true })
], Standard);
//# sourceMappingURL=standard.entity.js.map