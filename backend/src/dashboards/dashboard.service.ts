import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as jwt from 'jsonwebtoken';
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

  private getAuthContext(authHeader?: string) {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing authorization token');

    const secret = process.env.JWT_SECRET;

    if (!secret && process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('JWT secret is not configured.');
    }

    const signingSecret = secret || 'local_dev_secret_only';

    try {
      return jwt.verify(token, signingSecret) as {
        sub: string;
        email: string;
        tenantId: string;
        role: string;
      };
    } catch {
      throw new UnauthorizedException('Invalid authorization token');
    }
  }

  async getOverview(authHeader: string) {
    const auth = this.getAuthContext(authHeader);
    const now = new Date();

    const [
      totalReports,
      reviewQueueCount,
      openActions,
      overdueActions,
      completedActions,
      urgentActions,
    ] = await Promise.all([
      this.reportRepo.count({ where: { tenantId: auth.tenantId } as any }),
      this.reportRepo.count({ where: { tenantId: auth.tenantId, reportStatus: 'submitted' } as any }),
      this.actionRepo.count({ where: { tenantId: auth.tenantId, statusCode: Not('closed') } }),
      this.actionRepo
        .createQueryBuilder('action')
        .where('action.tenantId = :tenantId', { tenantId: auth.tenantId })
        .andWhere('action.statusCode NOT IN (:...closed)', { closed: ['closed', 'cancelled'] })
        .andWhere('action.dueDate IS NOT NULL')
        .andWhere('action.dueDate < :now', { now })
        .getCount(),
      this.actionRepo.count({ where: { tenantId: auth.tenantId, statusCode: 'closed' } }),
      this.actionRepo.count({ where: { tenantId: auth.tenantId, priorityCode: 'urgent', statusCode: Not('closed') } }),
    ]);

    const actionsByPriority = await this.actionRepo
      .createQueryBuilder('action')
      .select('action.priorityCode', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('action.tenantId = :tenantId', { tenantId: auth.tenantId })
      .groupBy('action.priorityCode')
      .getRawMany();

    const actionsByStatus = await this.actionRepo
      .createQueryBuilder('action')
      .select('action.statusCode', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('action.tenantId = :tenantId', { tenantId: auth.tenantId })
      .groupBy('action.statusCode')
      .getRawMany();

    const actionAging = await this.actionRepo
      .createQueryBuilder('action')
      .select(`
        CASE
          WHEN action."dueDate" IS NULL THEN 'No Due Date'
          WHEN action."dueDate" < NOW() THEN 'Overdue'
          WHEN action."dueDate" <= NOW() + INTERVAL '3 days' THEN 'Due Soon'
          ELSE 'Future'
        END
      `, 'bucket')
      .addSelect('COUNT(*)', 'count')
      .where('action.tenantId = :tenantId', { tenantId: auth.tenantId })
      .andWhere('action.statusCode NOT IN (:...closed)', { closed: ['closed', 'cancelled'] })
      .groupBy('bucket')
      .getRawMany();

    const hazardRecurrence = await this.reportRepo
      .createQueryBuilder('report')
      .select('COALESCE(report."eventTypeCode", \'Uncategorized\')', 'hazard')
      .addSelect('COUNT(*)', 'count')
      .where('report.tenantId = :tenantId', { tenantId: auth.tenantId })
      .groupBy('report."eventTypeCode"')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      totalReports,
      openReports: reviewQueueCount,
      reviewQueueCount,
      overdueActionsCount: overdueActions,
      openActions,
      overdueActions,
      completedActions,
      urgentActions,
      completionRate:
        openActions + completedActions > 0
          ? Math.round((completedActions / (openActions + completedActions)) * 100)
          : 0,
      analytics: {
        actionsByPriority,
        actionsByStatus,
        hazardRecurrence,
        aging: {
          actionAging,
          reviewAging: [
            { bucket: 'Pending Review', count: reviewQueueCount },
          ],
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
