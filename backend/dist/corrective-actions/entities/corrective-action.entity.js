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
exports.CorrectiveAction = void 0;
const typeorm_1 = require("typeorm");
let CorrectiveAction = class CorrectiveAction {
};
exports.CorrectiveAction = CorrectiveAction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "displayId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "reportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'default' }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "classificationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "assignedToUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "assignedToName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "priorityCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'open' }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "statusCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CorrectiveAction.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "closureNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "verifiedByUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CorrectiveAction.prototype, "verifiedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CorrectiveAction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CorrectiveAction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CorrectiveAction.prototype, "siteId", void 0);
exports.CorrectiveAction = CorrectiveAction = __decorate([
    (0, typeorm_1.Entity)('corrective_actions')
], CorrectiveAction);
//# sourceMappingURL=corrective-action.entity.js.map