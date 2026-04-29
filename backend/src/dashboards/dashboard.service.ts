import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { Site } from '../sites/entities/site.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CorrectiveAction) private actionRepo: Repository<CorrectiveAction>,
    @InjectRepository(Site) private siteRepo: Repository<Site>,
  ) {}

  async getExecutiveSummary(siteId?: string) {
    const query = this.actionRepo.createQueryBuilder('action');
    if (siteId) query.where('action.siteId = :siteId', { siteId });
    
    const actions = await query.getMany();
    const overdue = actions.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && a.statusCode !== 'closed');
    
    return {
      totalFindings: actions.length,
      openActions: actions.filter(a => a.statusCode !== 'closed').length,
      overdueActions: overdue.length,
      highRiskFindings: actions.filter(a => a.priorityCode === 'high').length,
      criticalRiskFindings: actions.filter(a => a.priorityCode === 'urgent').length,
      executiveSummaryText: `Operations tracking ${actions.length} findings across ${siteId ? 'selected site' : 'all sites'}.`
    };
  }

  async getCorporateSummary() {
    const sites = await this.siteRepo.find();
    const rankings = await Promise.all(sites.map(async s => {
        const actions = await this.actionRepo.find({ where: { siteId: s.id } });
        return {
            siteName: s.name,
            riskScore: actions.filter(a => a.priorityCode === 'urgent').length * 5,
            overdueCount: actions.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && a.statusCode !== 'closed').length,
            openActions: actions.filter(a => a.statusCode !== 'closed').length
        };
    }));
    return { totalSites: sites.length, siteRankings: rankings };
  }
}
