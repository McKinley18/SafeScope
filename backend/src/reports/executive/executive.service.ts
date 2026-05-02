import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../entities/report.entity';

@Injectable()
export class ExecutiveService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
  ) {}

  async generateExecutiveSummary(reportId: string) {
    const report = await this.repo.findOne({
      where: { id: reportId },
      relations: ['attachments'],
    });

    if (!report) throw new NotFoundException('Report not found');

    // SAFE NORMALIZATION
    const hazard = report.hazardDescription ?? 'No hazard identified';
    const severity = report.severity ?? 'unknown';
    const narrative = report.narrative ?? '';

    const standards = Array.isArray(report.likelyStandards)
      ? report.likelyStandards
      : [];

    // SAFE FINDINGS BUILD
    const findings = standards.map((s: any, i: number) => ({
      index: i + 1,
      citation: s?.citation ?? 'Not identified',
      agency: s?.agency ?? 'Unknown',
      scope: s?.scope ?? 'General',
      confidence: s?.confidence ?? 0,
    }));

    const primaryStandard =
      findings.length > 0 ? findings[0].citation : 'Not identified';

    // EXTRACT CORRECTIVE ACTION
    let correctiveAction = 'Corrective action required — refer to report details';

    if (narrative.includes('Recommended Corrective Action:')) {
      correctiveAction =
        narrative
          .split('Recommended Corrective Action:')[1]
          ?.split('\\n')[0]
          ?.trim() || correctiveAction;
    }

    // PROFESSIONAL SUMMARY
    const summary = \`
Inspection findings identified a condition involving \${hazard}.

The condition presents a \${severity} risk to personnel and site operations.

\${
      findings.length > 0
        ? \`Applicable regulatory consideration includes: \${findings
            .map((f) => f.citation)
            .join(', ')}.\`
        : 'No specific regulatory standard was automatically identified. A compliance review is recommended.'
    }

Recommended corrective action: \${correctiveAction}.
\`.trim();

    return {
      reportId: report.id,
      summary,
      details: {
        hazard,
        severity,
        findingsCount: findings.length,
        hasStandards: findings.length > 0,
        primaryStandard,
      },
      findings,
    };
  }
}
