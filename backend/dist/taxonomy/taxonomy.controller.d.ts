import { TaxonomyService } from './taxonomy.service';
export declare class TaxonomyController {
    private readonly taxonomyService;
    constructor(taxonomyService: TaxonomyService);
    getHazardCategories(): {
        code: string;
        label: string;
    }[];
    exportRules(): Promise<string>;
    importRules(dto: {
        csv: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
    createRule(dto: any, req: any): Promise<import("./entities/rule.entity").ClassificationRule>;
    rollbackRule(ruleId: string, versionId: string, req: any): Promise<import("./entities/rule.entity").ClassificationRule>;
    getSeverity(): {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
        VERY_HIGH: number;
        CRITICAL: number;
    };
}
