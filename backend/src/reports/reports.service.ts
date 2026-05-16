import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import { Finding } from './entities/finding.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { StandardsService } from '../standards/standards.service';
import { ActionEngineService } from '../action-engine/action-engine.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Finding)
    private findingRepo: Repository<Finding>,

    @InjectRepository(ReportAttachment)
    private attachmentRepo: Repository<ReportAttachment>,

    private standards: StandardsService,

    @Inject(forwardRef(() => ActionEngineService))
    private actionEngine: ActionEngineService,
  ) {}

  async create(body: any, user?: any) {
    const frontendReport = body.frontendReportJson || body.report || body;

    const report = this.reportRepo.create({
      organizationId: user?.organizationId || body.organizationId,
      createdByUserId: user?.userId ? String(user.userId) : body.createdByUserId,
      company: body.company || frontendReport.organizationName,
      site: body.site || frontendReport.siteLocation,
      inspector: body.inspector || frontendReport.leadInspector,
      confidential: body.confidential ?? frontendReport.isConfidential ?? false,
      frontendReportJson: frontendReport,
    });

    const savedReport = await this.reportRepo.save(report);

    const findings = [];
    const allActions = [];

    for (const f of frontendReport.findings || body.findings || []) {
      // 1. RUN STANDARDS ENGINE
      const matches = this.standards.match(f.hazardCategory || '');

      const finding = this.findingRepo.create({
        hazardCategory: f.hazardCategory,
        hazard: f.hazard || f.description,
        severity: f.severity,
        report: savedReport,
      });

      const savedFinding = await this.findingRepo.save(finding);

      // 2. RUN ACTION ENGINE (Deterministic operational execution)
      const actions = await this.actionEngine.generateActionsFromReport({
        id: savedReport.id,
        category: f.hazardCategory,
        description: f.hazard || f.hazardCategory, // 🔷 Pass hazard description
        riskScore: f.riskScore || 50, // Default for now
        riskLevel: f.riskLevel || "MODERATE",
        confidence: 0.90, // AI confidence baseline
        patterns: f.patterns || [],
        location: body.site || "Facility Floor",
        override: f.criticalOverride || false,
      });

      allActions.push(...actions);

      findings.push({
        ...savedFinding,
        standards: matches,
      });
    }

    return {
      ...savedReport,
      findings,
      generatedActions: allActions,
    };
  }


  async addAttachment(reportId: string, body: any, user?: any) {
    const report = await this.findOne(reportId, user);

    if (!report) {
      return null;
    }

    const attachment = this.attachmentRepo.create({
      reportId,
      imageUri: body.imageUri,
      mimeType: body.mimeType,
      fileName: body.fileName,
    });

    return this.attachmentRepo.save(attachment);
  }

  async findAll(user?: any) {
    return this.reportRepo.find({
      where: user?.organizationId ? { organizationId: user.organizationId } : {},
      relations: ['findings'],
      order: { reportedDatetime: 'DESC' },
    });
  }

  async findOne(id: string, user?: any) {
    const report = await this.reportRepo.findOne({
      where: user?.organizationId
        ? { id, organizationId: user.organizationId }
        : { id },
      relations: ['findings'],
    });

    if (!report) return null;

    const findings = report.findings.map((f) => ({
      ...f,
      standards: this.standards.match(f.hazardCategory || ''),
    }));

    return {
      ...report,
      findings,
    };
  }
}
