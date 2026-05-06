import { RiskService } from './risk.service';
export declare class RiskController {
    private service;
    constructor(service: RiskService);
    suggest(body: any): Promise<{
        severitySuggestion: string;
        likelihoodSuggestion: string;
        riskScore: number;
        riskLevel: string;
        priorityLabel: string;
        riskReasoning: string;
    }>;
}
