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
exports.StandardsController = void 0;
const common_1 = require("@nestjs/common");
const match_standards_dto_1 = require("./dto/match-standards.dto");
const standard_feedback_dto_1 = require("./dto/standard-feedback.dto");
const standards_service_1 = require("./standards.service");
let StandardsController = class StandardsController {
    constructor(standardsService) {
        this.standardsService = standardsService;
    }
    match(dto) {
        return this.standardsService.match(dto);
    }
    feedback(dto) {
        return this.standardsService.recordFeedback(dto);
    }
    search(query) {
        return this.standardsService.search(query ?? '');
    }
    findOne(citation) {
        return this.standardsService.findOne(citation);
    }
};
exports.StandardsController = StandardsController;
__decorate([
    (0, common_1.Post)('match'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_standards_dto_1.MatchStandardsDto]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "match", null);
__decorate([
    (0, common_1.Post)('feedback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [standard_feedback_dto_1.StandardFeedbackDto]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "feedback", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':citation'),
    __param(0, (0, common_1.Param)('citation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StandardsController.prototype, "findOne", null);
exports.StandardsController = StandardsController = __decorate([
    (0, common_1.Controller)('standards'),
    __metadata("design:paramtypes", [standards_service_1.StandardsService])
], StandardsController);
//# sourceMappingURL=standards.controller.js.map