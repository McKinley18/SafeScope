import { Controller, Post, Body } from '@nestjs/common';
import { SafeScopeService } from './safescope.service';
import { FeedbackService } from './engine/feedback.service';

@Controller('safescope')
export class SafeScopeController {
  constructor(
    private service: SafeScopeService,
    private feedbackService: FeedbackService
  ) {}

  @Post('analyze')
  analyze(@Body() body: any) {
    return this.service.analyze(body);
  }

  @Post('feedback')
  feedback(@Body() body: any) {
    this.feedbackService.add(body);
    return { status: 'feedback recorded' };
  }
}
