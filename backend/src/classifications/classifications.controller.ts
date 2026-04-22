import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ClassificationsService } from './classifications.service';

@Controller('classifications')
export class ClassificationsController {
  constructor(private readonly classificationsService: ClassificationsService) {}

  @Post(':classificationId/review')
  review(@Param('classificationId') classificationId: string, @Body() body: { action: any, notes: string }) {
    return this.classificationsService.review(classificationId, body.action, body.notes);
  }
}
