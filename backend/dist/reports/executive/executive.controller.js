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
exports.ExecutiveController = void 0;
const common_1 = require("@nestjs/common");
const executive_service_1 = require("./executive.service");
const pdf_service_1 = require("../pdf/pdf.service");
let ExecutiveController = class ExecutiveController {
    constructor(service, pdf) {
        this.service = service;
        this.pdf = pdf;
    }
    getExecutiveSummary(id) {
        return this.service.generateExecutiveSummary(id);
    }
    async getExecutivePdf(id, res) {
        const data = await this.service.generateExecutiveSummary(id);
        const pdfBuffer = await this.pdf.generateExecutivePdf(data);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=report-${id}.pdf`,
        });
        return res.send(pdfBuffer);
    }
};
exports.ExecutiveController = ExecutiveController;
__decorate([
    (0, common_1.Get)(':id/executive-summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExecutiveController.prototype, "getExecutiveSummary", null);
__decorate([
    (0, common_1.Get)(':id/executive-summary/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExecutiveController.prototype, "getExecutivePdf", null);
exports.ExecutiveController = ExecutiveController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [executive_service_1.ExecutiveService,
        pdf_service_1.PdfService])
], ExecutiveController);
//# sourceMappingURL=executive.controller.js.map