import { Controller, Get, Post, Query, Headers, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RegulatoryService } from './regulatory.service';
import { RegulatorySyncService } from './regulatory-sync.service';
import { ConfigService } from '@nestjs/config';

@Controller('regulatory')
export class RegulatoryController {
  constructor(private regService: RegulatoryService, private syncService: RegulatorySyncService, private config: ConfigService) {}

  @Get('parts') async getParts(@Query('agency') agency: string) { return await this.regService.getParts(agency); }
  @Get('sections') async searchSections(@Query('agency') agency: string, @Query('part') part: string, @Query('q') q: string) { return await this.regService.searchSections(agency, part, q); }

  @Post('sync')
  async sync(@Query('key') key: string, @Query('agency') agency: string, @Query('part') part: string, @Headers('x-sync-key') headerKey: string) {
    const envKey = this.config.get('REGULATORY_SYNC_KEY');
    if (process.env.NODE_ENV === 'production' && (!envKey || (key !== envKey && headerKey !== envKey))) {
      throw new UnauthorizedException();
    }
    
    const syncMap: Record<string, () => Promise<any>> = {
        '46': () => this.syncService.syncPart46(),
        '47': () => this.syncService.syncPart47(),
        '48': () => this.syncService.syncPart48(),
        '50': () => this.syncService.syncPart50(),
        '56': () => this.syncService.syncPart56(),
        '57': () => this.syncService.syncPart57(),
        '62': () => this.syncService.syncPart62(),
        '77': () => this.syncService.syncPart77(),
    };

    if (!part || !syncMap[part]) throw new BadRequestException('Unsupported regulatory sync target.');
    return await syncMap[part]();
  }
}
