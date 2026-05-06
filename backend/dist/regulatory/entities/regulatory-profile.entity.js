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
exports.RegulatoryProfile = void 0;
const typeorm_1 = require("typeorm");
let RegulatoryProfile = class RegulatoryProfile {
};
exports.RegulatoryProfile = RegulatoryProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RegulatoryProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', default: ['MSHA'] }),
    __metadata("design:type", Array)
], RegulatoryProfile.prototype, "enabledAgencies", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', default: ['56', '57'] }),
    __metadata("design:type", Array)
], RegulatoryProfile.prototype, "enabledMshaParts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', default: ['1910', '1926'] }),
    __metadata("design:type", Array)
], RegulatoryProfile.prototype, "enabledOshaParts", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RegulatoryProfile.prototype, "defaultAgency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RegulatoryProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RegulatoryProfile.prototype, "updatedAt", void 0);
exports.RegulatoryProfile = RegulatoryProfile = __decorate([
    (0, typeorm_1.Entity)()
], RegulatoryProfile);
//# sourceMappingURL=regulatory-profile.entity.js.map