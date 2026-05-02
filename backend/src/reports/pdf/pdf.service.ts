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

    const wrapText = (text: string, maxChars = 82) => {
      const words = String(text || '').split(/\s+/);
      const lines: string[] = [];
      let line = '';

      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (next.length > maxChars) {
          if (line) lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }

      if (line) lines.push(line);
      return lines;
    };

    const generated = new Date(data.generatedAt).toLocaleString();
    const dominantHazard = String(data.dominantHazard || 'Unknown').replace(/_/g, ' ');

    const commands: string[] = [];

    const text = (value: string, x: number, y: number, size = 10) => {
      commands.push(`BT /F1 ${size} Tf ${x} ${y} Td (${escapePdf(value)}) Tj ET`);
    };

    const rect = (x: number, y: number, w: number, h: number, color = '0.95 0.97 1') => {
      commands.push(`${color} rg ${x} ${y} ${w} ${h} re f`);
      commands.push('0 0 0 rg');
    };

    // Header
    rect(0, 720, 612, 72, '0.031 0.094 0.153');
    text('Sentinel Safety Executive Report', 50, 755, 18);
    text('See Risk. Prevent Harm.', 50, 735, 10);

    // Report info
    text('Executive Inspection Summary', 50, 685, 14);
    text(`Report ID: ${data.reportId}`, 50, 662, 10);
    text(`Generated: ${generated}`, 50, 646, 10);

    // Divider safely below metadata
    rect(50, 626, 512, 1, '0.85 0.88 0.92');

    // Metrics
    text('Key Metrics', 50, 598, 13);
    rect(50, 540, 512, 42, '0.96 0.98 1');
    text(`Total Findings: ${data.totalFindings}`, 70, 566, 10);
    text(`High-Risk Findings: ${data.highRiskFindings}`, 235, 566, 10);
    text(`Dominant Hazard: ${dominantHazard}`, 400, 566, 10);

    // Findings
    text('Identified Hazards', 50, 518, 13);
    let y = 496;

    const findings = Array.isArray(data.findings) ? data.findings : [];
    if (findings.length === 0) {
      text('No finding details available.', 70, y, 10);
      y -= 18;
    } else {
      for (const finding of findings.slice(0, 6)) {
        const label = `Finding ${finding.findingNumber}: ${String(finding.hazardFamily || 'review').replace(/_/g, ' ')}`;
        text(label, 70, y, 10);
        y -= 15;
        text(`Standard: ${finding.citation || 'Review Required'} | Priority: ${finding.priority || 'review'} | Score: ${finding.riskScore ?? 'N/A'}`, 90, y, 9);
        y -= 15;

        const actions = Array.isArray(finding.correctiveActions) ? finding.correctiveActions : [];
        if (actions.length) {
          for (const line of wrapText(`Actions: ${actions.join(' ')}`, 82).slice(0, 2)) {
            text(line, 90, y, 8);
            y -= 12;
          }
        }

        y -= 8;
      }
    }

    // Photo Evidence placeholder
    if (Array.isArray(data.photos) && data.photos.length > 0) {
      text(`Photo Evidence: ${data.photos.length} image(s) attached`, 50, y, 11);
      y -= 22;
    }

    // Summary
    text('Executive Summary', 50, y, 13);
    y -= 24;
    const summaryParagraphs = String(data.summary || 'No executive summary available.')
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);

    for (const paragraph of summaryParagraphs) {
      for (const line of wrapText(paragraph, 86)) {
        if (y < 145) break;
        text(line, 70, y, 10);
        y -= 15;
      }
      y -= 8;
    }

    // Footer / compliance note
    rect(50, 118, 512, 1, '0.85 0.88 0.92');
    text('Compliance Note', 50, 96, 12);

    const note =
      'Suggested standards and corrective actions support qualified review. Final compliance determinations remain with qualified safety personnel.';

    let noteY = 78;
    for (const line of wrapText(note, 98)) {
      text(line, 50, noteY, 8);
      noteY -= 12;
    }

    const content = commands.join('\n');

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
