export type AgencyCode = 'OSHA' | 'MSHA';
export type StandardScope = 'general_industry' | 'construction' | 'mining' | 'mixed';
export declare class Standard {
    id: string;
    agencyCode: AgencyCode;
    citation: string;
    partNumber?: string;
    subpart?: string;
    title: string;
    standardText: string;
    plainLanguageSummary?: string;
    scopeCode?: StandardScope;
    hazardCodes?: string[];
    requiredControls?: string[];
    keywords?: string[];
    severityWeight: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
