import { Controller, Post, Body } from '@nestjs/common';
import { ApplicableStandardsService } from './applicable-standards.service';
import { SuggestStandardsDto } from './dto/applicable-standards.dto';

@Controller('applicable-standards')
export class ApplicableStandardsController {
  constructor(private service: ApplicableStandardsService) {}

  @Post('suggest')
  async suggest(@Body() dto: SuggestStandardsDto) {
    return { matches: await this.service.suggest(dto.description, dto.hazardCategory, dto.source, dto.limit) };
  }
}
