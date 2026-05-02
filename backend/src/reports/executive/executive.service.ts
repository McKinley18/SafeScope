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

    const hazard = report.hazardDescription ?? 'No hazard identified';
    const severity = report.severity ?? 'unknown';

    const standards = Array.isArray(report.likelyStandards)
      ? report.likelyStandards
      : [];

    const findings = standards.map((s: any, i: number) => ({
      index: i + 1,
      citation: s?.citation ?? 'Not identified',
    }));

    const primaryStandard =
      findings.length > 0 ? findings[0].citation : 'Not identified';

    const summaryParts = [
      "Inspection findings identified a condition involving " + hazard + ".",
      "The condition presents a " + severity + " risk to personnel and operations.",
      findings.length > 0
        ? "Applicable standard(s): " + findings.map(f => f.citation).join(', ') + "."
        : "No specific regulatory standard was identified. Review recommended."
    ];

    const summary = summaryParts.join(" ");

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
