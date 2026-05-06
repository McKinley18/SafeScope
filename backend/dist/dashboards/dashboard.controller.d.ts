import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
    getSummary(siteId?: string): Promise<{
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
