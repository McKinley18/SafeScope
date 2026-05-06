export declare class RiskService {
    suggest(category: string, description: string): {
        severitySuggestion: string;
        likelihoodSuggestion: string;
        riskScore: number;
        riskLevel: string;
        priorityLabel: string;
        riskReasoning: string;
    };
}
