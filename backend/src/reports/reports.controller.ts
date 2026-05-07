import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // =========================
  // CREATE REPORT
  // =========================
  @Post()
  create(@Body() body: any) {
    return this.reportsService.create(body);
  }

  // =========================
  // GET ALL REPORTS
  // =========================
  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  // =========================
  // INTELLIGENCE (MUST BE BEFORE :id)
  // =========================
  @Get('intelligence')
  getIntelligence() {
    return this.reportsService.getIntelligence();
  }

  // =========================
  // FEEDBACK
  // =========================
  @Post('feedback')
  storeFeedback(@Body() body: any) {
    return this.reportsService.storeFeedback(body);
  }

  // =========================
  // GET ONE REPORT (ALWAYS LAST)
  // =========================
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }
}
