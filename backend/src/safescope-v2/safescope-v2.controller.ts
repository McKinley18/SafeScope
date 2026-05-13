import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SafescopeV2Service } from './safescope-v2.service';
import { ClassifyDto } from './dto/classify.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { Request } from 'express';

@Controller('safescope-v2')
export class SafescopeV2Controller {
  constructor(private service: SafescopeV2Service) {}

  @UseGuards(OptionalJwtGuard)
  @Post('classify')
  classify(@Body() body: ClassifyDto, @Req() req: Request & { user?: any }) {
    const workspaceId = req.user?.organizationId || body.workspaceId;
    return this.service.classify(body.text, body.scopes, body.evidenceTexts, body.riskProfileId, workspaceId);
  }
}
