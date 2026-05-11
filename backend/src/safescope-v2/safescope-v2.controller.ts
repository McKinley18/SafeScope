import { Controller, Post, Body } from '@nestjs/common';
import { SafescopeV2Service } from './safescope-v2.service';
import { ClassifyDto } from './dto/classify.dto';

@Controller('safescope-v2')
export class SafescopeV2Controller {
  constructor(private service: SafescopeV2Service) {}

  @Post('classify')
  classify(@Body() body: ClassifyDto) {
    return this.service.classify(body.text, body.scopes);
  }
}
