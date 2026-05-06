import { Repository } from 'typeorm';
import { ClassificationRule } from './entities/rule.entity';
import { ClassificationRuleVersion } from './entities/rule-version.entity';
import { AuditService } from '../audit/audit.service';
export declare class TaxonomyService {
    private ruleRepo;
    private versionRepo;
    private auditService;
    constructor(ruleRepo: Repository<ClassificationRule>, versionRepo: Repository<ClassificationRuleVersion>, auditService: AuditService);
    getHazardCategories(): {
        code: string;
        label: string;
    }[];
    getSeverityLevels(): {
        LOW: number;
        MEDIUM: number;
        HIGH: number;
        VERY_HIGH: number;
        CRITICAL: number;
    };
    findAllRules(): Promise<ClassificationRule[]>;
    createRule(dto: any, userId: string): Promise<ClassificationRule>;
    rollbackRule(ruleId: string, versionId: string, userId: string): Promise<ClassificationRule>;
}
