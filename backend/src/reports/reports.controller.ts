import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
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

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('eventTypeCode') eventTypeCode?: string,
  ) {
    return this.reportsService.findAll({ page, limit, status, eventTypeCode });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
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
