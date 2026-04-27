import { Body, Controller, Get, Post, Query, UnauthorizedException } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsSeedService } from './standards-seed.service';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService, private readonly seedService: StandardsSeedService) {}

  @Post('seed-defaults')
  async seedDefaults(@Query('key') key?: string) {
    const syncKey = process.env.STANDARDS_SYNC_KEY;

    if (process.env.NODE_ENV === 'production' && (!syncKey || key !== syncKey)) {
      throw new UnauthorizedException('Seed endpoint is disabled in production.');
    }

    return this.seedService.seedDefaults();
  }

  @Get()
  async search(
    @Query('q') q?: string,
    @Query('source') source?: string,
  ) {
    return this.standardsService.search(q, source);
  }

  @Post('suggest')
  async suggest(
    @Body() body: { description: string; source?: string; hazardCategory?: string },
  ) {
    return this.standardsService.suggest(body.description, body.source, body.hazardCategory);
  }
}
