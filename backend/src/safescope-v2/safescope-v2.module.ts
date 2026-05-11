import { Module } from '@nestjs/common';
import { SafescopeV2Service } from './safescope-v2.service';
import { SafescopeV2Controller } from './safescope-v2.controller';

@Module({
  controllers: [SafescopeV2Controller],
  providers: [SafescopeV2Service],
})
export class SafescopeV2Module {}
