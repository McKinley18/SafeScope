import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SupervisorValidationService } from './supervisor-validation.service';

@Controller('safescope-v2/supervisor-validations')
export class SupervisorValidationController {
  constructor(
    private readonly validations: SupervisorValidationService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.validations.createValidation(body);
  }

  @Get(':reasoningSnapshotId')
  history(@Param('reasoningSnapshotId') reasoningSnapshotId: string) {
    return this.validations.getValidationHistory(reasoningSnapshotId);
  }
}
