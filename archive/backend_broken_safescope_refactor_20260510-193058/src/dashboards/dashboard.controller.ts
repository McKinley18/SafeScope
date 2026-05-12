import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private service: DashboardService) {}

  @Get('executive-summary')
  async getSummary(@Query('siteId') siteId?: string) {
    return await this.service.getExecutiveSummary(siteId);
  }

  @Get('corporate-summary')
  async getCorporateSummary() {
    return await this.service.getCorporateSummary();
  }
}
