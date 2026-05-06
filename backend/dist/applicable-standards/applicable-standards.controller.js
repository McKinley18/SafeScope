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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicableStandardsController = void 0;
const common_1 = require("@nestjs/common");
const applicable_standards_service_1 = require("./applicable-standards.service");
const applicable_standards_dto_1 = require("./dto/applicable-standards.dto");
let ApplicableStandardsController = class ApplicableStandardsController {
    constructor(service) {
        this.service = service;
    }
    async suggest(dto) {
        return { matches: await this.service.suggest(dto.description, dto.hazardCategory, dto.source, dto.limit) };
    }
};
exports.ApplicableStandardsController = ApplicableStandardsController;
__decorate([
    (0, common_1.Post)('suggest'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [applicable_standards_dto_1.SuggestStandardsDto]),
    __metadata("design:returntype", Promise)
], ApplicableStandardsController.prototype, "suggest", null);
exports.ApplicableStandardsController = ApplicableStandardsController = __decorate([
    (0, common_1.Controller)('applicable-standards'),
    __metadata("design:paramtypes", [applicable_standards_service_1.ApplicableStandardsService])
], ApplicableStandardsController);
//# sourceMappingURL=applicable-standards.controller.js.map