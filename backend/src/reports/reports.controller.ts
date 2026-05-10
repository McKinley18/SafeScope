import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RecommendationsService } from '../recommendations/recommendations.service';

@UseGuards(JwtGuard)
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  create(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
@Post(':id/recommendations/feedback')
submitFeedback(@Body() body: any) {
  return this.recommendationsService.submitFeedback(body);
}

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Get(':id/recommendations')
  async getRecommendations(@Param('id') id: string) {
    const report = await this.reportsService.findOne(id);
    return this.recommendationsService.generate(report.findings);
  }
}
