export type RoutedSiteType = 'mining' | 'construction' | 'general_industry' | 'mixed';
export declare const SYNONYM_GROUPS: Record<string, string[]>;
export declare function expandObservationTerms(input: string): {
    expandedText: string;
    detectedHazardFamilies: string[];
};
export declare function routeJurisdiction(input: {
    siteType?: RoutedSiteType;
    observation: string;
    locationType?: string;
    equipmentType?: string;
    activityType?: string;
    detectedLabels?: string[];
}): {
    preferredScope: RoutedSiteType;
    reasons: string[];
};
