export declare class AuditAnalysisService {
    analyzeEntry(input: {
        notes?: string;
        locationText?: string;
    }): Promise<{
        title: string;
        observedCondition: string;
        hazardCategoryCode: string;
        applicableStandards: any[];
        severityLevel: number;
        suggestedFix: string;
        confidenceScore: number;
        aiReasoning: {
            summary: string;
            methodology: string;
            confidence: number;
        };
        verificationStatus: string;
    }>;
}
