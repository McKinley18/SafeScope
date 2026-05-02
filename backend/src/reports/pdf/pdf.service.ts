import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  generateExecutivePdf(data: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(20).text('Sentinel Safety Report', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Report ID: ${data.reportId}`);
      doc.text(`Generated: ${new Date(data.generatedAt).toLocaleString()}`);
      doc.moveDown();

      doc.text(`Total Findings: ${data.totalFindings}`);
      doc.text(`High Risk Findings: ${data.highRiskFindings}`);
      doc.text(`Dominant Hazard: ${data.dominantHazard}`);
      doc.moveDown();

      doc.text('Executive Summary:', { underline: true });
      doc.moveDown();
      doc.text(data.summary);

      doc.end();
    });
  }
}
