import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private service: ReportService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }
}
