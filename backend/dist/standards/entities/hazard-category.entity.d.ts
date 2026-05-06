export declare class HazardCategoryEntity {
    id: string;
    code: string;
    name: string;
    description: string;
    defaultSeverity: 'low' | 'medium' | 'high' | 'urgent';
    commonKeywords: string[];
    createdAt: Date;
    updatedAt: Date;
}
