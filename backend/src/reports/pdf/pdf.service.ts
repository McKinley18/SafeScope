import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');
const path = require('path');

@Injectable()
export class PdfService {
  async generateExecutivePdf(data: any): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: any[] = [];

    doc.on('data', buffers.push.bind(buffers));

    const logoPath = path.join(process.cwd(), 'src/assets/logo.png');

    // ===== HEADER =====
    try {
    // outline (draw slightly larger behind)
    doc.image(logoPath, 49, 44, { width: 37 });

    // main logo
    doc.image(logoPath, 50, 45, { width: 35 });
    } catch (e) {
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

    const section = (title: string, body: string) => {
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

    renderSection(doc, 'Overview', data.overview);
    renderSection(doc, 'Risk Evaluation', data.riskEvaluation);
    renderSection(doc, 'Standards', data.standards);
    renderSection(doc, 'Corrective Actions', data.correctiveActions);
    renderSection(doc, 'Compliance Note', data.complianceNote);

    doc.end();

    return await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}

// ===== Improved Section Renderer =====
const renderSection = (doc: any, title: string, body: string) => {
  doc
    .strokeColor('#e0e0e0')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown(0.5);

  doc
    .fontSize(14)
    .fillColor('#1f4e79')
    .text(title, { underline: true });

  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .fillColor('#333333')
    .text(body || '', { lineGap: 2 });

  doc.moveDown(1.2);
};
