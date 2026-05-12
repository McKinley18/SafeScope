import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classification } from './entities/classification.entity';
import { Report } from '../reports/entities/report.entity';
import { AuditService } from '../audit/audit.service';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { RuleEngine } from './rule-engine.service';
import { EntityExtractorService } from './entity-extractor.service';

@Injectable()
export class ClassificationsService {
  constructor(
    @InjectRepository(Classification)
    private classificationRepository: Repository<Classification>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private auditService: AuditService,
    private taxonomyService: TaxonomyService,
    private ruleEngine: RuleEngine,
    private entityExtractor: EntityExtractorService,
  ) {}

  async findByReportId(reportId: string): Promise<Classification[]> {
    return this.classificationRepository.find({ where: { reportId } });
  }

  async classify(reportId: string): Promise<Classification> {
    const report = await this.reportRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    const entities = this.entityExtractor.extract(report.narrative);
    const result = this.ruleEngine.classify(report.narrative);

    const classification = this.classificationRepository.create({
      reportId,
      classifierType: 'RULE_ENGINE_V1',
      classifierVersion: '1.0.0',
      eventTypeCode: report.eventTypeCode,
      hazardCategoryCode: result.hazardCategoryCode,
      severityLevel: result.severityLevel,
      confidenceScore: result.confidenceScore,
      requiresHumanReview: result.requiresHumanReview,
      extractedEntities: entities,
      reasoningSummary: { ...result.reasoningSummary, extractedEntities: entities },
    });

    const saved = await this.classificationRepository.save(classification);
    
    await this.auditService.log({
      entityType: 'CLASSIFICATION',
      entityId: saved.id,
      actionCode: 'CLASSIFICATION_CREATED',
      afterJson: saved,
      metadataJson: { reportId },
    });

    return saved;
  }

  async review(classificationId: string, action: string, notes: string, reason?: string): Promise<Classification> {
    const classification = await this.classificationRepository.findOne({ where: { id: classificationId } });
    if (!classification) throw new NotFoundException('Classification not found');

    classification.classificationStatus = action;
    classification.reviewedAt = new Date();
    classification.reviewReason = reason || notes;
    await this.classificationRepository.save(classification);

    await this.auditService.log({
      entityType: 'CLASSIFICATION',
      entityId: classification.id,
      actionCode: `REVIEW_${action.toUpperCase()}`,
      afterJson: classification,
      metadataJson: { notes, reason },
    });

    return classification;
  }
}
