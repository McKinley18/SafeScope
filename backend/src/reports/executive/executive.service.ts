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

    const overview = "An inspection identified a condition involving " + hazard + ".";

    const riskEvaluation =
      "The condition presents a " +
      severity +
      " risk to personnel and site operations, requiring timely corrective action.";

    const standardsText =
      findings.length > 0
        ? "Applicable regulatory standards include: " +
          findings.map(f => f.citation).join(', ') +
          "."
        : "No specific regulatory standard was automatically identified. A compliance review is recommended.";

    const correctiveActions =
      "Recommended corrective action should be implemented to address the identified hazard and restore compliance.";

    const complianceNote =
      "Final compliance determination should be made by a qualified safety professional in accordance with MSHA/OSHA regulations.";

    return {
      reportId: report.id,
      overview,
      riskEvaluation,
      standards: standardsText,
      correctiveActions,
      complianceNote,
      metadata: {
        severity,
        hasStandards: findings.length > 0,
        findingsCount: findings.length,
      },
      findings,
    };
  }
}
