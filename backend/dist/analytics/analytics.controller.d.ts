import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSafetyTrends(): Promise<{
        totalReports: number;
        classifiedReports: number;
        topHazardFamilies: {
            label: string;
            count: number;
        }[];
        topStandards: {
            label: string;
            count: number;
        }[];
        priorityDistribution: {
            label: string;
            count: number;
        }[];
        repeatAreas: {
            label: string;
            count: number;
        }[];
        highRiskCount: number;
        repeatIssues: {
            citation: string;
            count: number;
        }[];
        dominantHazard: string;
        riskTrend: string;
        generatedAt: string;
    }>;
}
