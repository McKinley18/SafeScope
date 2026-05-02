import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  async generateExecutivePdf(data: any): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: any[] = [];

    doc.on('data', buffers.push.bind(buffers));

    const {
      overview,
      riskEvaluation,
      standards,
      correctiveActions,
      complianceNote,
      metadata,
    } = data;

    doc.fontSize(18).text('EXECUTIVE SUMMARY', { underline: true });
    doc.moveDown();

    doc.fontSize(12).text('Overview:', { bold: true });
    doc.text(overview);
    doc.moveDown();

    doc.text('Risk Evaluation:', { bold: true });
    doc.text(riskEvaluation);
    doc.moveDown();

    doc.text('Standards:', { bold: true });
    doc.text(standards);
    doc.moveDown();

    doc.text('Corrective Actions:', { bold: true });
    doc.text(correctiveActions);
    doc.moveDown();

    doc.text('Compliance Note:', { bold: true });
    doc.text(complianceNote);
    doc.moveDown();

    doc.text(`Severity: ${metadata.severity}`);
    doc.text(`Findings Count: ${metadata.findingsCount}`);

    doc.end();

    return await new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });
  }
}
