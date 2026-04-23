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
    return {
      totalReports: 0,
      openReports: 0,
      reviewQueueCount: 0,
      overdueActionsCount: 0,
      analytics: {},
      timestamp: new Date().toISOString(),
    };
  }
}
