import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AuditSessionService } from './audit-session.service';
import { AuditAnalysisService } from './audit-analysis.service';

@Controller('audit-sessions')
export class AuditSessionController {
  constructor(
    private readonly sessionService: AuditSessionService,
    private readonly analysisService: AuditAnalysisService,
  ) {}

  @Post()
  createSession(@Body() dto: any) {
    return this.sessionService.createSession(dto);
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(id);
  }

  @Post(':id/entries')
  addEntry(@Param('id') id: string, @Body() dto: any) {
    return this.sessionService.addEntry(id, dto);
  }

  @Post(':sessionId/entries/:entryId/analyze')
  analyzeEntry(@Param('entryId') entryId: string, @Body() dto: any) {
    return this.analysisService.analyzeEntry({
      notes: dto?.notes,
      locationText: dto?.locationText,
    });
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string) {
    return this.sessionService.publish(id);
  }
}
