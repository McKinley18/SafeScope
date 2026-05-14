import {
  NotFoundException,
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

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
  create(@Body() body: CreateReportDto, @Req() req: Request & { user?: any }) {
    return this.reportsService.create(body, req.user);
  }

  @Post(':id/recommendations/feedback')
  submitFeedback(@Body() body: any) {
    return this.recommendationsService.submitFeedback(body);
  }

  @Get()
  findAll(@Req() req: Request & { user?: any }) {
    return this.reportsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request & { user?: any }) {
    return this.reportsService.findOne(id, req.user);
  }

  @Get(':id/recommendations')
  async getRecommendations(@Param('id') id: string, @Req() req: Request & { user?: any }) {
    const report = await this.reportsService.findOne(id, req.user);

    if (!report) {
      throw new NotFoundException("Report not found");
    }

    return this.recommendationsService.generate(report.findings);
  }
}
