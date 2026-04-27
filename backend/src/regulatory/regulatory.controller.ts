import { Controller, Get, Post, Query, Param, Body, UnauthorizedException, Headers } from '@nestjs/common';
import { RegulatoryService } from './regulatory.service';
import { RegulatorySyncService } from './regulatory-sync.service';
import { ConfigService } from '@nestjs/config';

@Controller('regulatory')
export class RegulatoryController {
  constructor(
    private regService: RegulatoryService,
    private syncService: RegulatorySyncService,
    private config: ConfigService,
  ) {}

  @Get('parts')
  async getParts(@Query('agency') agency: string) {
    return await this.regService.getParts(agency);
  }

  @Get('sections')
  async searchSections(@Query('agency') agency: string, @Query('part') part: string, @Query('q') q: string) {
    return await this.regService.searchSections(agency, part, q);
  }

  @Get('sections/:citation')
  async getSection(@Param('citation') citation: string) {
    return await this.regService.getSection(decodeURIComponent(citation));
  }

  @Post('sync')
  async sync(@Query('key') key: string, @Headers('x-sync-key') headerKey: string) {
    const envKey = this.config.get('REGULATORY_SYNC_KEY');
    if (process.env.NODE_ENV === 'production' && (!envKey || (key !== envKey && headerKey !== envKey))) {
      throw new UnauthorizedException('Invalid sync key.');
    }
    return await this.syncService.syncFullPart56();
  }
}
