import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');
const path = require('path');

@Injectable()
export class PdfService {
  async generateExecutivePdf(data: any): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: any[] = [];

    doc.on('data', buffers.push.bind(buffers));

    const logoPath = path.join(process.cwd(), 'src/assets/logo-icon.png');

    // ===== HEADER =====
    try {
      doc.image(logoPath, 50, 45, { width: 50 });
    } catch (e) {
      console.warn('Logo not found');
    }

    doc
      .fontSize(20)
      .fillColor('#1f4e79')
      .text('Sentinel Safety', 120, 50);

    doc
      .fontSize(10)
      .fillColor('#666666')
      .text('See Risk. Prevent Harm.', 120, 72);

    doc
      .strokeColor('#cccccc')
      .lineWidth(1)
      .moveTo(50, 110)
      .lineTo(550, 110)
      .stroke();

    doc.x = 50;
    doc.y = 140;

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

    section('Overview', data.overview);
    section('Risk Evaluation', data.riskEvaluation);
    section('Standards', data.standards);
    section('Corrective Actions', data.correctiveActions);
    section('Compliance Note', data.complianceNote);

    doc.end();

    return await new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
  }
}
