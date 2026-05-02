import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfService {
  generateExecutivePdf(data: any): Buffer {
    const escapePdf = (value: any) =>
      String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\r?\n/g, '\\n');

    const title = 'Sentinel Safety Executive Report';
    const generated = new Date(data.generatedAt).toLocaleString();
    const dominantHazard = String(data.dominantHazard || 'Unknown').replace(/_/g, ' ');

    const lines = [
      { text: title, size: 18, x: 50, y: 750 },
      { text: 'See Risk. Prevent Harm.', size: 10, x: 50, y: 728 },
      { text: 'Executive Inspection Summary', size: 14, x: 50, y: 690 },
      { text: `Report ID: ${data.reportId}`, size: 10, x: 50, y: 670 },
      { text: `Generated: ${generated}`, size: 10, x: 50, y: 654 },
      { text: 'Key Metrics', size: 13, x: 50, y: 610 },
      { text: `Total Findings: ${data.totalFindings}`, size: 10, x: 70, y: 588 },
      { text: `High-Risk Findings: ${data.highRiskFindings}`, size: 10, x: 70, y: 572 },
      { text: `Dominant Hazard: ${dominantHazard}`, size: 10, x: 70, y: 556 },
      { text: 'Executive Summary', size: 13, x: 50, y: 520 },
    ];

    const summaryLines = String(data.summary || 'No executive summary available.')
      .split('\n')
      .flatMap((line) => {
        const chunks = [];
        let remaining = line;
        while (remaining.length > 88) {
          chunks.push(remaining.slice(0, 88));
          remaining = remaining.slice(88);
        }
        chunks.push(remaining);
        return chunks;
      });

    let y = 498;
    for (const line of summaryLines) {
      lines.push({ text: line, size: 10, x: 70, y });
      y -= 15;
    }

    lines.push({ text: 'Compliance Note', size: 12, x: 50, y: 110 });
    lines.push({
      text: 'Suggested standards and corrective actions support qualified review. Final compliance determinations remain with qualified safety personnel.',
      size: 8,
      x: 50,
      y: 92,
    });

    const drawText = lines
      .map((line) => `BT /F1 ${line.size} Tf ${line.x} ${line.y} Td (${escapePdf(line.text)}) Tj ET`)
      .join('\n');

    const graphics = [
      '0.031 0.094 0.153 rg 0 720 612 72 re f',
      '1 1 1 rg',
      '0.9 0.9 0.9 rg 50 625 512 1 re f',
      '0.05 0.23 0.46 rg 50 615 512 1 re f',
      '0.95 0.97 1 rg 50 540 512 1 re f',
      '0.9 0.9 0.9 rg 50 125 512 1 re f',
      '0 0 0 rg',
    ].join('\n');

    const content = `${graphics}\n${drawText}`;

    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
      '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
      `5 0 obj << /Length ${Buffer.byteLength(content)} >> stream\n${content}\nendstream endobj`,
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    for (const obj of objects) {
      offsets.push(Buffer.byteLength(pdf));
      pdf += obj + '\n';
    }

    const xrefOffset = Buffer.byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';

    for (let i = 1; i <= objects.length; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }

    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(pdf);
  }
}
