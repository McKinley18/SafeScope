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

    const findings = standards.map((s: any, i: number) => ({
      findingNumber: i + 1,
      hazardFamily: s.primaryFamily || s.family || 'other',
      citation: s.citation || 'Review Required',
      priority:
        s.riskAssessment?.finalPriority ||
        report.severity ||
        'review',
      riskScore: s.riskAssessment?.customerRiskScore ?? null,
    }));

    const photos = Array.isArray((report as any).attachments)
      ? (report as any).attachments
          .map((a: any) => a.url || a.uri || a.fileUrl || a.publicUrl)
          .filter(Boolean)
      : [];

    return {
      reportId,
      displayId: report.displayId,
      title: report.title,
      hazardDescription: report.hazardDescription,
      totalFindings: findings.length,
      highRiskFindings: findings.length,
      dominantHazard:
        findings[0]?.hazardFamily || 'unknown',
      findings,
      photos,
      summary: report.narrative || 'No summary available',
      generatedAt: new Date().toISOString(),
    };
  }
}
