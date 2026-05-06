import { Repository } from 'typeorm';
import { Classification } from './entities/classification.entity';
import { Report } from '../reports/entities/report.entity';
import { AuditService } from '../audit/audit.service';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { RuleEngine } from './rule-engine.service';
import { EntityExtractorService } from './entity-extractor.service';
export declare class ClassificationsService {
    private classificationRepository;
    private reportRepository;
    private auditService;
    private taxonomyService;
    private ruleEngine;
    private entityExtractor;
    constructor(classificationRepository: Repository<Classification>, reportRepository: Repository<Report>, auditService: AuditService, taxonomyService: TaxonomyService, ruleEngine: RuleEngine, entityExtractor: EntityExtractorService);
    findByReportId(reportId: string): Promise<Classification[]>;
    classify(reportId: string): Promise<Classification>;
    review(classificationId: string, action: string, notes: string, reason?: string): Promise<Classification>;
}
