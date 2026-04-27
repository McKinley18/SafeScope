import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { StandardsService } from './standards.service';

@Controller('standards')
export class StandardsController {
  constructor(private standardsService: StandardsService) {}

  @Get()
  async getAll(@Query('q') q: string, @Query('source') source: string) {
    return await this.standardsService.search(q, source);
  }

  @Post('suggest')
  async suggest(@Body() body: { description: string, source?: string, hazardCategory?: string }) {
    return await this.standardsService.suggest(body.description, body.source, body.hazardCategory);
  }
}
