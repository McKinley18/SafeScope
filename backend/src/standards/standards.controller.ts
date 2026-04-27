import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StandardsService } from './standards.service';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  async search(
    @Query('q') q?: string,
    @Query('source') source?: string,
  ) {
    return this.standardsService.search(q, source);
  }

  @Post('suggest')
  async suggest(
    @Body() body: { description: string; source?: string },
  ) {
    return this.standardsService.suggest(body.description, body.source);
  }
}
