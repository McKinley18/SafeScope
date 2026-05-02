import { Controller, Get, Param } from '@nestjs/common';
import { ExecutiveService } from './executive.service';

@Controller('reports')
export class ExecutiveController {
  constructor(private readonly service: ExecutiveService) {}

  @Get(':id/executive-summary')
  getExecutiveSummary(@Param('id') id: string) {
    return this.service.generateExecutiveSummary(id);
  }
}
