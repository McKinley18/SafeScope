export declare class RuleEngine {
    private readonly rules;
    classify(narrative: string): {
        hazardCategoryCode: any;
        severityLevel: any;
        confidenceScore: number;
        requiresHumanReview: boolean;
        reasoningSummary: {
            summary: string;
            methodology: string;
            confidence: number;
            matchedKeywords: any[];
            matchedRules: any[];
            extractedEntities: any[];
        };
    };
}
