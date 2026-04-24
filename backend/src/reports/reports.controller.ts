import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import * as jwt from 'jsonwebtoken';
import {
  AddReportEvidenceDto,
  CreateReportDto,
  UpdateReportDto,
} from './dto/report.dto';
import { ClassificationsService } from '../classifications/classifications.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly classificationsService: ClassificationsService,
  ) {}

  private getAuthContext(authHeader?: string) {
    try {
      const token = authHeader?.replace('Bearer ', '');
      if (!token) return { tenantId: 'default', userId: undefined };

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'safescope_dev_secret_change_me',
      );

      return {
        tenantId: decoded.tenantId || 'default',
        userId: decoded.sub,
      };
    } catch {
      return { tenantId: 'default', userId: undefined };
    }
  }

  @Get()
  findAll(
    @Headers('authorization') authorization: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('eventTypeCode') eventTypeCode?: string,
  ) {
    const auth = this.getAuthContext(authorization);

    return this.reportsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status,
      eventTypeCode,
      tenantId: auth.tenantId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Post()
  create(@Headers('authorization') authorization: string, @Body() createReportDto: CreateReportDto) {
    const auth = this.getAuthContext(authorization);

    return this.reportsService.create({
      ...createReportDto,
      tenantId: auth.tenantId,
      createdByUserId: auth.userId,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.reportsService.archive(id);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.reportsService.softDelete(id);
  }

  @Post(':id/review-decision')
  decideReview(
    @Param('id') id: string,
    @Body() body: { decision: 'approved' | 'rejected'; notes?: string },
  ) {
    return this.reportsService.decideReview(id, body);
  }

  @Post(':reportId/evidence')
  addEvidence(
    @Param('reportId') reportId: string,
    @Body() addReportEvidenceDto: AddReportEvidenceDto,
  ) {
    return this.reportsService.addEvidence(reportId, addReportEvidenceDto);
  }

  @Post(':reportId/detect-hazard')
  detectHazard(@Param('reportId') reportId: string) {
    return this.reportsService.detectHazard(reportId);
  }

  @Post(':reportId/classify')
  classify(@Param('reportId') reportId: string) {
    return this.classificationsService.classify(reportId);
  }

  @Get(':reportId/classifications')
  findByReport(@Param('reportId') reportId: string) {
    return this.classificationsService.findByReportId(reportId);
  }
}
