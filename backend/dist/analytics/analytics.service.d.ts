import { Repository } from 'typeorm';
import { Report } from '../reports/entities/report.entity';
export declare class AnalyticsService {
    private readonly reportsRepo;
    constructor(reportsRepo: Repository<Report>);
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
