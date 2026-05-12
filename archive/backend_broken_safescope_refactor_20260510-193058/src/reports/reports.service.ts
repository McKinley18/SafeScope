import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Report } from './entities/report.entity';
import { Finding } from './entities/finding.entity';
import { StandardsService } from '../standards/standards.service';
import { ActionEngineService } from '../action-engine/action-engine.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Finding)
    private findingRepo: Repository<Finding>,

    private standards: StandardsService,

    @Inject(forwardRef(() => ActionEngineService))
    private actionEngine: ActionEngineService,
  ) {}

  async create(body: any) {
    const report = this.reportRepo.create({
      company: body.company,
      inspector: body.inspector,
    });

    const savedReport = await this.reportRepo.save(report);

    const findings = [];
    const allActions = [];

    for (const f of body.findings || []) {
      // 1. RUN STANDARDS ENGINE
      const matches = this.standards.match(f.hazardCategory || '');

      const finding = this.findingRepo.create({
        hazardCategory: f.hazardCategory,
        hazard: f.hazard,
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

  async findAll() {
    return this.reportRepo.find({
      relations: ['findings'],
    });
  }

  async findOne(id: string) {
    const report = await this.reportRepo.findOne({
      where: { id },
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
