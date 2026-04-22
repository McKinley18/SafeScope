import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
import { Classification } from '../classifications/entities/classification.entity';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(Classification) private classificationRepo: Repository<Classification>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(CorrectiveAction) private actionRepo: Repository<CorrectiveAction>,
  ) {}

  async getOverview() {
    const totalReports = await this.reportRepo.count();
    const openReports = await this.reportRepo.count({ where: { reportStatus: 'open' } });
    const reviewQueueCount = await this.classificationRepo.count({ where: { classificationStatus: 'pending' } });
    const overdueActionsCount = await this.actionRepo.count({ where: { statusCode: 'open' } }); // Simplified

    const reportsOverTime = await this.reportRepo
      .createQueryBuilder('r')
      .select("DATE_TRUNC('day', r.reportedDatetime)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const pendingVsReviewed = await this.classificationRepo
      .createQueryBuilder('c')
      .select('c.classificationStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.classificationStatus')
      .getRawMany();

    const slaMetrics = await this.classificationRepo
      .createQueryBuilder('c')
      .select('AVG(EXTRACT(EPOCH FROM (c.reviewedAt - c.createdAt)))', 'avgReviewTime')
      .where('c.reviewedAt IS NOT NULL')
      .getRawOne();

    const actionPerformance = await this.actionRepo
      .createQueryBuilder('a')
      .select('AVG(EXTRACT(EPOCH FROM (a.verifiedAt - a.createdAt)))', 'avgCloseTime')
      .where('a.verifiedAt IS NOT NULL')
      .getRawOne();

    const hazardRecurrence = await this.reportRepo
      .createQueryBuilder('r')
      .leftJoin('classifications', 'c', 'c.reportId = r.id')
      .select('c.hazardCategoryCode', 'hazard')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.hazardCategoryCode')
      .orderBy('count', 'DESC')
      .getRawMany();

    const reviewAging = await this.classificationRepo
      .createQueryBuilder('c')
      .select("CASE WHEN (CURRENT_DATE - c.createdAt) <= 2 THEN '0-2d' WHEN (CURRENT_DATE - c.createdAt) <= 7 THEN '3-7d' WHEN (CURRENT_DATE - c.createdAt) <= 14 THEN '8-14d' ELSE '15+d' END", 'bucket')
      .addSelect('COUNT(*)', 'count')
      .where('c.classificationStatus = :status', { status: 'pending' })
      .groupBy('bucket')
      .getRawMany();

    const actionAging = await this.actionRepo
      .createQueryBuilder('a')
      .select("CASE WHEN (CURRENT_DATE - a.createdAt) <= 7 THEN '0-7d' WHEN (CURRENT_DATE - a.createdAt) <= 14 THEN '8-14d' WHEN (CURRENT_DATE - a.createdAt) <= 30 THEN '15-30d' ELSE '30+d' END", 'bucket')
      .addSelect('COUNT(*)', 'count')
      .where('a.statusCode != :status', { status: 'closed' })
      .groupBy('bucket')
      .getRawMany();

    return {
      // ... existing
      analytics: {
        avgReviewTime: slaMetrics.avgReviewTime / 3600,
        avgCloseTime: actionPerformance.avgCloseTime / 86400,
        hazardRecurrence,
        aging: {
          reviewAging,
          actionAging,
        }
      },
      timestamp: new Date().toISOString(),
    };
  }
}
