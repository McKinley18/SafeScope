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
exports.ClassificationRuleVersion = void 0;
const typeorm_1 = require("typeorm");
let ClassificationRuleVersion = class ClassificationRuleVersion {
};
exports.ClassificationRuleVersion = ClassificationRuleVersion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassificationRuleVersion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClassificationRuleVersion.prototype, "ruleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ClassificationRuleVersion.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json'),
    __metadata("design:type", Object)
], ClassificationRuleVersion.prototype, "snapshot", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'published' }),
    __metadata("design:type", String)
], ClassificationRuleVersion.prototype, "status", void 0);
exports.ClassificationRuleVersion = ClassificationRuleVersion = __decorate([
    (0, typeorm_1.Entity)('classification_rule_versions')
], ClassificationRuleVersion);
//# sourceMappingURL=rule-version.entity.js.map