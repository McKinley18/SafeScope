export declare class Classification {
    id: string;
    reportId: string;
    classifierType: string;
    classifierVersion: string;
    classificationStatus: string;
    eventTypeCode: string;
    hazardCategoryCode: string;
    hazardSubcategoryCode: string;
    rootCauseCategoryCode: string;
    rootCauseSubcategoryCode: string;
    severityLevel: number;
    likelihoodLevel: string;
    areaTypeCode: string;
    regulationRefs: string[];
    extractedEntities: any;
    reasoningSummary: Record<string, any>;
    confidenceScore: number;
    requiresHumanReview: boolean;
    reviewReason: string;
    reviewedAt: Date;
    createdAt: Date;
}
