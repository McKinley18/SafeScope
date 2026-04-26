import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(CorrectiveAction)
    private actionRepo: Repository<CorrectiveAction>,
    private notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async scanDueDates() {
    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;

    const actions = await this.actionRepo.find({
      order: { dueDate: 'ASC' },
    });

    let created = 0;

    for (const action of actions) {
      if (!action.tenantId || !action.assignedToUserId || !action.dueDate) continue;
      if (action.statusCode === 'closed' || action.statusCode === 'cancelled') continue;

      const due = new Date(action.dueDate).getTime();
      const isOverdue = due < now;
      const isDueSoon = due >= now && due <= now + oneDay;

      const type = isOverdue ? 'overdue_action' : isDueSoon ? 'due_soon_action' : null;
      if (!type) continue;

      const existing = await this.notificationsService.findExistingForEntity({
        tenantId: action.tenantId,
        userId: action.assignedToUserId,
        type: type as any,
        entityType: 'CORRECTIVE_ACTION',
        entityId: action.id,
      });

      if (existing) continue;

      await this.notificationsService.create({
        tenantId: action.tenantId,
        userId: action.assignedToUserId,
        type: type as any,
        title: isOverdue ? 'Corrective action overdue' : 'Corrective action due soon',
        message: `${action.title || 'Corrective action'} is ${isOverdue ? 'overdue' : 'due within 24 hours'}.`,
        entityType: 'CORRECTIVE_ACTION',
        entityId: action.id,
      });

      created += 1;
    }

    if (created > 0) {
      this.logger.log(`Created ${created} due date alert(s).`);
    }
  }
}
