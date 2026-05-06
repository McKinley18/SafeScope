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
exports.RegulatorySection = void 0;
const typeorm_1 = require("typeorm");
let RegulatorySection = class RegulatorySection {
};
exports.RegulatorySection = RegulatorySection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RegulatorySection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegulatorySection.prototype, "agencyCode", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegulatorySection.prototype, "titleNumber", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegulatorySection.prototype, "part", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "subpart", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegulatorySection.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RegulatorySection.prototype, "citation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "heading", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "textPlain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "summaryPlainLanguage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "sourceUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "upToDateAsOf", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatorySection.prototype, "lastAmendedOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], RegulatorySection.prototype, "lastSyncedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RegulatorySection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RegulatorySection.prototype, "updatedAt", void 0);
exports.RegulatorySection = RegulatorySection = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['citation'])
], RegulatorySection);
//# sourceMappingURL=regulatory-section.entity.js.map