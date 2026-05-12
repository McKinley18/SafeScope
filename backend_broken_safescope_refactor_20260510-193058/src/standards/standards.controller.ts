import { Controller, Post, Body } from '@nestjs/common';
import { StandardsService } from './standards.service';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post('match')
  match(@Body() body: { text: string }) {
    return this.standardsService.match(body.text);
  }
}
