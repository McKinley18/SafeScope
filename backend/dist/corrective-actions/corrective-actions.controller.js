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
exports.CorrectiveActionsController = void 0;
const common_1 = require("@nestjs/common");
const corrective_actions_service_1 = require("./corrective-actions.service");
const corrective_action_dto_1 = require("./dto/corrective-action.dto");
let CorrectiveActionsController = class CorrectiveActionsController {
    constructor(service) {
        this.service = service;
    }
    findAll(authorization, page = 1, limit = 20, statusCode, priorityCode, assignedToMe) {
        return this.service.findAll(authorization, { page, limit, statusCode, priorityCode, assignedToMe: assignedToMe === 'true' });
    }
    create(authorization, dto) {
        return this.service.create(authorization, dto);
    }
    updateStatus(authorization, id, body) {
        return this.service.updateStatus(authorization, id, body);
    }
    generateDueDateAlerts(authorization) {
        return this.service.generateDueDateAlerts(authorization);
    }
    async export(statusCode, priorityCode, format = 'json') {
        const data = await this.service.export(statusCode, priorityCode);
        if (format === 'csv') {
            const header = Object.keys(data[0] || {}).join(',');
            const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
            return header + '\n' + rows;
        }
        return data;
    }
};
exports.CorrectiveActionsController = CorrectiveActionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('statusCode')),
    __param(4, (0, common_1.Query)('priorityCode')),
    __param(5, (0, common_1.Query)('assignedToMe')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], CorrectiveActionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, corrective_action_dto_1.CreateCorrectiveActionDto]),
    __metadata("design:returntype", void 0)
], CorrectiveActionsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CorrectiveActionsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('alerts/scan'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CorrectiveActionsController.prototype, "generateDueDateAlerts", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)('statusCode')),
    __param(1, (0, common_1.Query)('priorityCode')),
    __param(2, (0, common_1.Query)('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CorrectiveActionsController.prototype, "export", null);
exports.CorrectiveActionsController = CorrectiveActionsController = __decorate([
    (0, common_1.Controller)('actions'),
    __metadata("design:paramtypes", [corrective_actions_service_1.CorrectiveActionsService])
], CorrectiveActionsController);
//# sourceMappingURL=corrective-actions.controller.js.map