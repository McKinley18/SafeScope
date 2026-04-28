import { Controller, Post, Body } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private service: RiskService) {}

  @Post('suggest')
  async suggest(@Body() body: any) {
    return this.service.suggest(body.hazardCategory, body.hazardDescription || body.description || '');
  }
}
