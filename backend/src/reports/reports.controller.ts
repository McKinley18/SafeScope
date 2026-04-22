import { Controller, Get, Post, Body, Param , Query} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/report.dto';
import { ClassificationsService } from '../classifications/classifications.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly classificationsService: ClassificationsService,
  ) {}

  @Get(':id/audit')
  async getAudit(@Param('id') id: string) {
    return this.reportsService.getAudit(id);
  }

  @Get('export')
  async export(
    @Query('status') status?: string,
    @Query('eventTypeCode') eventTypeCode?: string,
    @Query('format') format: string = 'json',
  ) {
    const data = await this.reportsService.export(status, eventTypeCode);
    if (format === 'csv') {
      // Basic CSV conversion
      const header = Object.keys(data[0] || {}).join(',');
      const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
      return header + '\n' + rows;
    }
    return data;
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('eventTypeCode') eventTypeCode?: string,
  ) {
    return this.reportsService.findAll({ page, limit, status, eventTypeCode });
  }

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
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
