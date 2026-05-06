import { Repository } from 'typeorm';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';
import { Site } from '../sites/entities/site.entity';
export declare class DashboardService {
    private actionRepo;
    private siteRepo;
    constructor(actionRepo: Repository<CorrectiveAction>, siteRepo: Repository<Site>);
    getExecutiveSummary(siteId?: string): Promise<{
        totalFindings: number;
        openActions: number;
        overdueActions: number;
        highRiskFindings: number;
        criticalRiskFindings: number;
        executiveSummaryText: string;
    }>;
    getCorporateSummary(): Promise<{
        totalSites: number;
        siteRankings: {
            siteName: string;
            riskScore: number;
            overdueCount: number;
            openActions: number;
        }[];
    }>;
}
