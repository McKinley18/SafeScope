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
exports.ControlVerificationsController = void 0;
const common_1 = require("@nestjs/common");
const control_verifications_service_1 = require("./control-verifications.service");
let ControlVerificationsController = class ControlVerificationsController {
    constructor(svc) {
        this.svc = svc;
    }
    async verify(reportId, body) {
        return this.svc.create(reportId, body);
    }
    async get(reportId) {
        return this.svc.getForReport(reportId);
    }
};
exports.ControlVerificationsController = ControlVerificationsController;
__decorate([
    (0, common_1.Post)(":reportId"),
    __param(0, (0, common_1.Param)("reportId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ControlVerificationsController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)(":reportId"),
    __param(0, (0, common_1.Param)("reportId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ControlVerificationsController.prototype, "get", null);
exports.ControlVerificationsController = ControlVerificationsController = __decorate([
    (0, common_1.Controller)("control-verifications"),
    __metadata("design:paramtypes", [control_verifications_service_1.ControlVerificationsService])
], ControlVerificationsController);
//# sourceMappingURL=control-verifications.controller.js.map