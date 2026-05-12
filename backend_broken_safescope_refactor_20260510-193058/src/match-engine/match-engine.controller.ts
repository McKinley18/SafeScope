import { Controller, Post, Body } from '@nestjs/common';
import { MatchEngineService } from './match-engine.service';

@Controller('match')
export class MatchEngineController {
  constructor(private service: MatchEngineService) {}

  @Post('hazard')
  async match(@Body() body: any) {
    return this.service.match(body.description, body.hazardCategory, body.industryMode);
  }
}
