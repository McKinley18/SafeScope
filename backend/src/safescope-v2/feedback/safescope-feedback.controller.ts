import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SafeScopeFeedbackService } from './safescope-feedback.service';
import { CreateSafeScopeFeedbackDto } from './create-feedback.dto';

@Controller('safescope-v2/feedback')
export class SafeScopeFeedbackController {
  constructor(
    private readonly service: SafeScopeFeedbackService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateSafeScopeFeedbackDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  async getWorkspaceSignals(
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.service.getWorkspaceSignals(workspaceId);
  }

  @Get('adjustments')
  async getWorkspaceAdjustments(
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.service.getWorkspaceStandardAdjustments(workspaceId);
  }
}
