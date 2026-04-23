import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AddReportEvidenceDto,
  CreateReportDto,
  UpdateReportDto,
} from './dto/report.dto';
import { Report } from './entities/report.entity';
import { ReportAttachment } from './entities/attachment.entity';
import { AuditService } from '../audit/audit.service';
import { ClassificationsService } from '../classifications/classifications.service';
import { Review } from '../reviews/entities/review.entity';
import { CorrectiveAction } from '../corrective-actions/entities/corrective-action.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(ReportAttachment)
    private attachmentsRepository: Repository<ReportAttachment>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(CorrectiveAction)
    private actionRepo: Repository<CorrectiveAction>,
    private auditService: AuditService,
    private classificationsService: ClassificationsService,
  ) {}

  async getAudit(reportId: string) {
    const report = await this.reportsRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');
    return this.auditService.getAuditByEntityId(reportId);
  }

  async findOne(id: string) {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!report) throw new NotFoundException('Report not found');

    const classifications = await this.classificationsService.findByReportId(id);
    const reviews = await this.reviewRepo.find({ where: { reportId: id } });
    const actions = await this.actionRepo.find({ where: { reportId: id } });

    return {
      ...report,
      classifications,
      reviews,
      actions,
    };
  }

  private buildFilter(status?: string, eventTypeCode?: string) {
    const where: any = {};
    if (status) where.reportStatus = status;
    if (eventTypeCode) where.eventTypeCode = eventTypeCode;
    return where;
  }

  async findAll(options: {
    page: number;
    limit: number;
    status?: string;
    eventTypeCode?: string;
  }): Promise<{ data: Report[]; meta: { total: number; page: number; limit: number } }> {
    const { page, limit, status, eventTypeCode } = options;
    const where = this.buildFilter(status, eventTypeCode);

    const [data, total] = await this.reportsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { reportedDatetime: 'DESC' },
    });

    return {
      data,
      meta: { total, page, limit },
    };
  }

  async export(status?: string, eventTypeCode?: string) {
    const where = this.buildFilter(status, eventTypeCode);
    return this.reportsRepository.find({ where, order: { reportedDatetime: 'DESC' } });
  }

  async create(dto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create({
      ...dto,
      eventDatetime: dto.eventDatetime ? new Date(dto.eventDatetime) : undefined,
      reportedDatetime: new Date(),
      reportStatus: dto.reportStatus ?? 'draft',
      intakeStatus: 'received',
    });

    const saved = await this.reportsRepository.save(report);

    await this.auditService.log({
      entityType: 'REPORT',
      entityId: saved.id,
      actionCode: 'REPORT_CREATED',
      afterJson: saved,
    });

    return saved;
  }

  async update(id: string, dto: UpdateReportDto): Promise<Report> {
    const report = await this.reportsRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    const next = this.reportsRepository.merge(report, {
      ...dto,
      eventDatetime: dto.eventDatetime ? new Date(dto.eventDatetime) : report.eventDatetime,
    });

    const saved = await this.reportsRepository.save(next);

    await this.auditService.log({
      entityType: 'REPORT',
      entityId: saved.id,
      actionCode: 'REPORT_UPDATED',
      afterJson: saved,
    });

    return saved;
  }

  async addEvidence(reportId: string, dto: AddReportEvidenceDto) {
    const report = await this.reportsRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    const attachments = dto.attachments.map((item) =>
      this.attachmentsRepository.create({
        reportId,
        imageUri: item.uri,
        mimeType: item.mimeType,
        fileName: item.fileName,
      }),
    );

    const savedAttachments = await this.attachmentsRepository.save(attachments);

    await this.auditService.log({
      entityType: 'REPORT',
      entityId: reportId,
      actionCode: 'REPORT_EVIDENCE_ADDED',
      afterJson: savedAttachments,
    });

    return {
      reportId,
      attachments: savedAttachments,
    };
  }
}
