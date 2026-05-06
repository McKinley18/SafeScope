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
exports.ClassificationsController = void 0;
const common_1 = require("@nestjs/common");
const classifications_service_1 = require("./classifications.service");
let ClassificationsController = class ClassificationsController {
    constructor(classificationsService) {
        this.classificationsService = classificationsService;
    }
    review(classificationId, body) {
        return this.classificationsService.review(classificationId, body.action, body.notes);
    }
};
exports.ClassificationsController = ClassificationsController;
__decorate([
    (0, common_1.Post)(':classificationId/review'),
    __param(0, (0, common_1.Param)('classificationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassificationsController.prototype, "review", null);
exports.ClassificationsController = ClassificationsController = __decorate([
    (0, common_1.Controller)('classifications'),
    __metadata("design:paramtypes", [classifications_service_1.ClassificationsService])
], ClassificationsController);
//# sourceMappingURL=classifications.controller.js.map