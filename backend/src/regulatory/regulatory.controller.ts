import { Controller, Post, Query, Headers, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { RegulatorySyncService } from './regulatory-sync.service';
import { ConfigService } from '@nestjs/config';

@Controller('regulatory')
export class RegulatoryController {
  constructor(private syncService: RegulatorySyncService, private config: ConfigService) {}

  @Post('sync')
  async sync(@Query('key') key: string, @Query('part') part: string, @Headers('x-sync-key') headerKey: string) {
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
        '1904': () => this.syncService.syncOsha1904(),
        '1910': () => this.syncService.syncOsha1910(),
        '1926': () => this.syncService.syncOsha1926(),
    };

    if (!part || !syncMap[part]) throw new BadRequestException('Unsupported regulatory sync target.');
    return await syncMap[part]();
  }
}
