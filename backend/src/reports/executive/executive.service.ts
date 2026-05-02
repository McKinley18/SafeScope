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

    const standards = Array.isArray(report.likelyStandards)
      ? report.likelyStandards
      : [];

    const findings = standards.map((s: any, index: number) => ({
      findingNumber: index + 1,
      hazardFamily: s.primaryFamily || s.family || 'other',
      citation: s.citation || 'Review Required',
      priority:
        s.suggestedPriority ||
        s.riskAssessment?.finalPriority ||
        report.severity ||
        'review',
      confidence: s.confidence ?? null,
      correctiveActions: s.correctiveActions || [],
      verificationSteps: s.verificationSteps || [],
      riskScore: s.riskAssessment?.customerRiskScore ?? null,
    }));

    const topHazard =
      findings.length > 0
        ? findings[0].hazardFamily
        : report.severity || 'unknown';

    const highRisk = findings.filter((f: any) =>
      ['high', 'critical'].includes(String(f.priority).toLowerCase()),
    );

    const photos = Array.isArray((report as any).attachments)
      ? (report as any).attachments
          .map((a: any) => a.url || a.uri || a.fileUrl)
          .filter(Boolean)
      : [];

    return {
      reportId,
      displayId: report.displayId,
      title: report.title,
      hazardDescription: report.hazardDescription,
      totalFindings: findings.length,
      highRiskFindings: highRisk.length,
      dominantHazard: topHazard,
      findings,
      photos,
      summary: `
During this inspection, ${findings.length} safety finding(s) were identified.

The most significant hazard category observed was ${String(topHazard).replace(/_/g, ' ')}.

${
  highRisk.length
    ? `${highRisk.length} high-risk condition(s) require immediate attention.`
    : `No high-risk conditions identified.`
}
      `.trim(),
      generatedAt: new Date().toISOString(),
    };
  }
}
