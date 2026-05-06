export declare class RiskScore {
    id: string;
    reportId: string;
    classificationId: string;
    severityScore: number;
    recurrenceScore: number;
    trendScore: number;
    controlFailureScore: number;
    confidenceModifier: number;
    compositeRiskScore: number;
    riskBand: 'low' | 'medium' | 'high' | 'critical';
    calculatedAt: Date;
}
