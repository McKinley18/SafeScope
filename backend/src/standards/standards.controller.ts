import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MatchStandardsDto } from './dto/match-standards.dto';
import { StandardFeedbackDto } from './dto/standard-feedback.dto';
import { StandardsService } from './standards.service';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post('match')
  match(@Body() dto: MatchStandardsDto) {
    return this.standardsService.match(dto);
  }

  @Post('feedback')
  feedback(@Body() dto: StandardFeedbackDto) {
    return this.standardsService.recordFeedback(dto);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.standardsService.search(query ?? '');
  }

  @Get(':citation')
  findOne(@Param('citation') citation: string) {
    return this.standardsService.findOne(citation);
  }
}
