import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { Finding } from './entities/finding.entity';
import { StandardsService } from '../standards/standards.service';
import { IntelligenceService } from '../intelligence/intelligence.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(Finding)
    private findingRepo: Repository<Finding>,

    private standardsService: StandardsService,
    private intelligenceService: IntelligenceService,
    private alertsService: AlertsService
  ) {}

  // =========================
  // CREATE REPORT (SAFE + DB)
  // =========================
  async create(body: any) {
    // 🔍 DEBUG LOG (keep for now)
    console.log('Incoming BODY:', body);

    // =========================
    // 🚨 VALIDATION (PREVENT DB CRASH)
    // =========================
    if (!body) {
      throw new BadRequestException('Request body is missing');
    }

    const { company, site, inspector, type, findings } = body;

    if (!company || !site || !inspector || !type) {
      throw new BadRequestException(
        'Missing required fields: company, site, inspector, type'
      );
    }

    if (!Array.isArray(findings) || findings.length === 0) {
      throw new BadRequestException('At least one finding is required');
    }

    // =========================
    // 🧱 BUILD ENTITY
    // =========================
    const report = this.reportRepo.create({
      company,
      site,
      inspector,
      type,
      confidential: !!body.confidential,
      findings: findings.map((f: any) => {
        if (!f.hazard || f.severity == null || f.likelihood == null) {
          throw new BadRequestException(
            'Each finding must include hazard, severity, and likelihood'
          );
        }

        return {
          hazard: f.hazard,
          severity: Number(f.severity),
          likelihood: Number(f.likelihood),
          standards: this.standardsService.matchStandards(
            f.hazard,
            type
          ),
        };
      }),
    });

    // =========================
    // 💾 SAVE TO DB
    // =========================
    const saved = await this.reportRepo.save(report);

    // =========================
    // 📊 BUILD INTELLIGENCE
    // =========================
    const allReports = await this.reportRepo.find({
      relations: ['findings'],
    });

    const intel = this.intelligenceService.buildIntelligence(allReports);
    const alerts = this.alertsService.generateAlerts(intel);

    return {
      ...saved,
      summary: this.buildSummary(saved),
      alerts,
    };
  }

  // =========================
  // GET ALL REPORTS
  // =========================
  async findAll() {
    return this.reportRepo.find({ relations: ['findings'] });
  }

  // =========================
  // GET ONE REPORT
  // =========================
  async findOne(id: string) {
    return this.reportRepo.findOne({
      where: { id },
      relations: ['findings'],
    });
  }

  // =========================
  // INTELLIGENCE (DB)
  // =========================
  async getIntelligence() {
    const reports = await this.reportRepo.find({
      relations: ['findings'],
    });

    const intel = this.intelligenceService.buildIntelligence(reports);
    const alerts = this.alertsService.generateAlerts(intel);

    return {
      ...intel,
      alerts,
    };
  }

  // =========================
  // FEEDBACK LOOP
  // =========================
  storeFeedback(body: any) {
    return this.standardsService.storeFeedback(body);
  }

  // =========================
  // SUMMARY BUILDER
  // =========================
  private buildSummary(report: any) {
    let criticalRisk = 0;
    let highRisk = 0;

    for (const f of report.findings || []) {
      const risk = f.severity * f.likelihood;

      if (risk >= 16) criticalRisk++;
      else if (risk >= 9) highRisk++;
    }

    return {
      totalFindings: report.findings.length,
      criticalRisk,
      highRisk,
      topFindings: report.findings.map((f: any) => ({
        hazard: f.hazard,
        priority:
          f.severity * f.likelihood >= 16
            ? 'Critical'
            : 'Moderate',
      })),
    };
  }
}
