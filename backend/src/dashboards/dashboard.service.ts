import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CorrectiveAction) private actionRepo: Repository<CorrectiveAction>,
  ) {}

  async getExecutiveSummary() {
    const actions = await this.actionRepo.find();
    
    const overdue = actions.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && a.statusCode !== 'closed');
    const completed = actions.filter(a => a.statusCode === 'closed');
    
    return {
      totalFindings: actions.length,
      openActions: actions.filter(a => a.statusCode !== 'closed').length,
      overdueActions: overdue.length,
      highRiskFindings: actions.filter(a => a.priorityCode === 'high').length,
      criticalRiskFindings: actions.filter(a => a.priorityCode === 'urgent').length,
      completedActions: completed.length,
      riskBreakdown: { critical: 0, high: 0, moderate: 0, low: 0 },
      topRisks: actions.filter(a => a.priorityCode === 'urgent').slice(0, 5),
      overdueItems: overdue.slice(0, 5),
      commonStandards: [],
      executiveSummaryText: 'Operations currently tracking ' + actions.length + ' findings. Please review overdue corrective actions immediately.'
    };
  }
}
