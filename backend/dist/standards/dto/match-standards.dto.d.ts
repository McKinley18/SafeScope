export declare class MatchStandardsDto {
    observation: string;
    locationType?: string;
    equipmentType?: string;
    activityType?: string;
    siteType?: 'general_industry' | 'construction' | 'mining' | 'mixed';
    detectedLabels?: string[];
    limit?: number;
    includeLowConfidence?: boolean;
}
