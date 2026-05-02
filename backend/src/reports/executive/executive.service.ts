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
    const report = await this.repo.findOne({ where: { id: reportId } });

    if (!report) throw new NotFoundException('Report not found');

    const standards = Array.isArray(report.likelyStandards)
      ? report.likelyStandards
      : [];

    const hazards = standards.map((s: any) => s.primaryFamily || 'other');

    const topHazard =
      hazards.length > 0
        ? hazards.sort((a, b) =>
            hazards.filter(v => v === a).length -
            hazards.filter(v => v === b).length
          ).pop()
        : 'unknown';

    const highRisk = standards.filter((s: any) =>
      ['high', 'critical'].includes(
        String(
          s.suggestedPriority ||
          s.riskAssessment?.finalPriority ||
          ''
        ).toLowerCase()
      )
    );

    const summary = `
During this inspection, ${standards.length} safety findings were identified.

The most significant hazard category observed was ${topHazard.replace(/_/g, ' ')}.

${
  highRisk.length > 0
    ? `A total of ${highRisk.length} high-risk conditions were identified requiring immediate attention.`
    : `No high-risk conditions were identified during this inspection.`
}

Key applicable standards include:
${standards.map((s: any) => `- ${s.citation || 'Review Required'}`).join('\n')}

It is recommended that corrective actions be prioritized based on risk level and recurrence trends.
    `.trim();

    return {
      reportId,
      totalFindings: standards.length,
      highRiskFindings: highRisk.length,
      dominantHazard: topHazard,
      summary,
      generatedAt: new Date().toISOString(),
    };
  }
}
