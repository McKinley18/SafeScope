import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Report } from '../reports/entities/report.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepo: Repository<Report>,
  ) {}

  async getSafetyTrends() {
    const reports = await this.reportsRepo.find({
      where: {
        deletedAt: IsNull(),
        archivedAt: IsNull(),
      },
      order: { reportedDatetime: 'DESC' },
      take: 500,
    });

    const submittedReports = reports.filter((r) =>
      ['submitted', 'reviewed', 'closed', 'draft'].includes(
        String(r.reportStatus || '').toLowerCase(),
      ),
    );

    const hazardFamilies = new Map<string, number>();
    const standards = new Map<string, number>();
    const priorities = new Map<string, number>();
    const areas = new Map<string, number>();

    for (const report of submittedReports) {
      const likelyStandards = Array.isArray(report.likelyStandards)
        ? report.likelyStandards
        : [];

      for (const standard of likelyStandards) {
        const family = standard.primaryFamily || standard.family || 'other';
        const citation = standard.citation || 'Review Required';
        const priority =
          standard.suggestedPriority ||
          standard.riskAssessment?.finalPriority ||
          report.severity ||
          'review';

        hazardFamilies.set(family, (hazardFamilies.get(family) || 0) + 1);
        standards.set(citation, (standards.get(citation) || 0) + 1);
        priorities.set(priority, (priorities.get(priority) || 0) + 1);
      }

      if (report.area) {
        areas.set(report.area, (areas.get(report.area) || 0) + 1);
      }
    }

    const top = (map: Map<string, number>, limit = 10) =>
      Array.from(map.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    return {
      totalReports: submittedReports.length,
      classifiedReports: submittedReports.filter((r) => r.aiStatus === 'classified').length,
      topHazardFamilies: top(hazardFamilies),
      topStandards: top(standards),
      priorityDistribution: top(priorities),
      repeatAreas: top(areas),
      generatedAt: new Date().toISOString(),
    };
  }
}
