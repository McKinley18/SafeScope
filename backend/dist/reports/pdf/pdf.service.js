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
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const executive_service_1 = require("../executive/executive.service");
const PDFDocument = require('pdfkit');
const path = require('path');
let PdfService = class PdfService {
    constructor(executiveService) {
        this.executiveService = executiveService;
    }
    async generateExecutivePdf(data) {
        const intel = await this.executiveService.generateExecutiveSummary(data.id);
        const doc = new PDFDocument({ margin: 50 });
        const renderSection = (doc, title, body) => {
            doc.fontSize(12).fillColor("#1f4e79").text(title);
            doc.moveDown(0.3);
            doc
                .fontSize(11)
                .fillColor("#000000")
                .text(body || "", {
                width: 500,
                align: "left",
            });
            doc.moveDown(1);
        };
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        const logoPath = path.join(process.cwd(), 'src/assets/logo.png');
        try {
            doc.image(logoPath, 49, 44, { width: 37 });
            doc.image(logoPath, 50, 45, { width: 35 });
        }
        catch (e) {
            console.warn('Logo not found');
        }
        doc
            .fontSize(20)
            .fillColor('#1f4e79')
            .text('Sentinel Safety', 95, 60);
        doc
            .fontSize(10)
            .fillColor('#666666')
            .text('See Risk. Prevent Harm.', 95, 80);
        doc
            .strokeColor('#cccccc')
            .lineWidth(1)
            .moveTo(50, 90)
            .lineTo(550, 90)
            .stroke();
        doc.x = 50;
        doc.y = 100;
        const section = (title, body) => {
            doc
                .fontSize(12)
                .fillColor('#1f4e79')
                .text(title);
            doc.moveDown(0.3);
            doc
                .fontSize(11)
                .fillColor('#000000')
                .text(body || '');
            doc.moveDown(1);
        };
        renderSection(doc, 'Overview', intel.overview);
        renderSection(doc, 'Risk Evaluation', intel.riskEvaluation);
        renderSection(doc, "Top Risk Priorities", intel.riskPriorities);
        renderSection(doc, "Immediate Actions Required", intel.immediateAction);
        renderSection(doc, "Priority Actions", intel.prioritizedActions);
        renderSection(doc, 'Standards', intel.standards);
        renderSection(doc, 'Corrective Actions', intel.correctiveActions);
        renderSection(doc, 'Compliance Note', intel.complianceNote);
        doc.end();
        return await new Promise((resolve) => {
            doc.on("end", () => resolve(Buffer.concat(buffers)));
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [executive_service_1.ExecutiveService])
], PdfService);
//# sourceMappingURL=pdf.service.js.map